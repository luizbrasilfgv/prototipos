// Testa o firestore.rules na API de testes de regras do Firebase, sem publicar nada.
// Rode SEMPRE antes de "firebase deploy --only firestore:rules": uma regra errada tranca
// todo mundo fora do app. Usa o login do Firebase CLI (rode "firebase login" antes).
//
// Uso:   node scripts/testar_regras.js [arquivo.rules]     (padrão: firestore.rules da raiz)
//
// Cada caso é uma pessoa (sem login, pendente, membro, editor, admin, conta nova, dono)
// fazendo algo que o app faz. Se o app ganhar um acesso novo ao banco, acrescente o caso aqui.
const path = require('path'), fs = require('fs'), { execSync } = require('child_process');
const FT = path.join(execSync('npm root -g').toString().trim(), 'firebase-tools');
const auth = require(path.join(FT, 'lib/auth.js'));
const scopes = require(path.join(FT, 'lib/scopes.js'));
const cfg = require(path.join(FT, 'lib/configstore.js')).configstore;
const REGRAS = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', 'firestore.rules'), 'utf8');
const D = '/databases/(default)/documents';

// Pessoas: cadastro existente (ou null) e e-mail do login
const P = {
  anon:   null,
  pend:   { uid: 'p1', email: 'pend@x.com', doc: { email: 'pend@x.com', status: 'pending', roles: ['member'] } },
  membro: { uid: 'm1', email: 'membro@x.com', doc: { email: 'membro@x.com', status: 'approved', roles: ['member'] } },
  editor: { uid: 'e1', email: 'editor@x.com', doc: { email: 'editor@x.com', status: 'approved', roles: ['member', 'editor'] } },
  admin:  { uid: 'a1', email: 'admin@x.com', doc: { email: 'admin@x.com', status: 'approved', roles: ['member', 'admin'] } },
  novo:   { uid: 'n1', email: 'novo@x.com', doc: null },
  dono:   { uid: 'd1', email: 'luizbrasil.rj@gmail.com', doc: null },
};
const userDoc = (status = 'approved', roles = ['member']) => ({ email: 'membro@x.com', status, roles });

function caso(nome, quem, metodo, doc, esperado, { novo, atual } = {}) {
  const p = P[quem];
  const request = { path: `${D}/${doc}`, method: metodo };
  if (p) request.auth = { uid: p.uid, token: { email: p.email, email_verified: true } };
  if (novo) request.resource = { data: novo };
  const t = { expectation: esperado, request };
  if (atual) t.resource = { data: atual };
  // get()/exists() devolvem o cadastro de quem está logado
  if (p) t.functionMocks = [
    { function: 'exists', args: [{ anyValue: {} }], result: { value: !!p.doc } },
    ...(p.doc ? [{ function: 'get', args: [{ anyValue: {} }], result: { value: { data: p.doc } } }] : []),
  ];
  return { nome, t };
}

const ev = { events: [{ id: 1, date: '2026-10-13', payer: 'Leo', present: ['Leo'] }] };
const ev2 = { events: [...ev.events, { id: 2, date: '2026-10-14', payer: 'Ademir', present: ['Ademir'] }] };
const casos = [
  caso('sem login lê lançamentos', 'anon', 'get', 'coffee/data_v3', 'DENY'),
  caso('sem login grava lançamentos', 'anon', 'update', 'coffee/data_v3', 'DENY', { novo: ev2, atual: ev }),
  caso('sem login lê cadastro', 'anon', 'get', 'users/m1', 'DENY'),
  caso('sem login lista cadastros', 'anon', 'list', 'users/m1', 'DENY'),
  caso('pendente lê lançamentos', 'pend', 'get', 'coffee/data_v3', 'DENY'),
  caso('pendente lê o próprio cadastro', 'pend', 'get', 'users/p1', 'ALLOW'),
  caso('pendente se aprova', 'pend', 'update', 'users/p1', 'DENY', { atual: P.pend.doc, novo: { ...P.pend.doc, status: 'approved' } }),
  caso('membro lê lançamentos', 'membro', 'get', 'coffee/data_v3', 'ALLOW'),
  caso('membro lança café', 'membro', 'update', 'coffee/data_v3', 'ALLOW', { atual: ev, novo: ev2 }),
  caso('membro grava log', 'membro', 'update', 'coffee/logs_v3', 'ALLOW', { atual: { list: [] }, novo: { list: [{ id: 1 }] } }),
  caso('membro cria logs se não existir', 'membro', 'create', 'coffee/logs_v3', 'ALLOW', { novo: { list: [] } }),
  caso('membro lê participantes', 'membro', 'get', 'coffee/config_v3', 'ALLOW'),
  caso('membro muda participantes', 'membro', 'update', 'coffee/config_v3', 'DENY', { atual: { participants: ['Leo'] }, novo: { participants: ['Leo', 'X'] } }),
  caso('admin muda participantes/apelidos', 'admin', 'update', 'coffee/config_v3', 'ALLOW', { atual: { participants: ['Leo'] }, novo: { participants: ['Leo', 'X'] } }),
  caso('membro apaga lançamentos', 'membro', 'delete', 'coffee/data_v3', 'DENY', { atual: ev }),
  caso('editor lança/edita café', 'editor', 'update', 'coffee/data_v3', 'ALLOW', { atual: ev2, novo: ev }),
  caso('membro lista cadastros', 'membro', 'list', 'users/a1', 'DENY'),
  caso('admin lista cadastros (painel)', 'admin', 'list', 'users/m1', 'ALLOW'),
  caso('membro lê cadastro alheio', 'membro', 'get', 'users/a1', 'DENY'),
  caso('membro diz quem é (Meu Dash)', 'membro', 'update', 'users/m1', 'ALLOW', { atual: userDoc(), novo: { ...userDoc(), participante: 'Leo' } }),
  caso('membro troca quem é', 'membro', 'update', 'users/m1', 'ALLOW', { atual: { ...userDoc(), participante: 'Leo' }, novo: { ...userDoc(), participante: 'Samuel' } }),
  caso('membro vira admin sozinho', 'membro', 'update', 'users/m1', 'DENY', { atual: userDoc(), novo: userDoc('approved', ['member', 'admin']) }),
  caso('membro muda status + participante', 'membro', 'update', 'users/m1', 'DENY', { atual: userDoc('pending'), novo: { ...userDoc('approved'), participante: 'Leo' } }),
  caso('membro mexe no cadastro de outro', 'membro', 'update', 'users/a1', 'DENY', { atual: userDoc(), novo: { ...userDoc(), participante: 'Leo' } }),
  caso('participante não-texto', 'membro', 'update', 'users/m1', 'DENY', { atual: userDoc(), novo: { ...userDoc(), participante: 42 } }),
  caso('admin aprova alguém', 'admin', 'update', 'users/p1', 'ALLOW', { atual: P.pend.doc, novo: { ...P.pend.doc, status: 'approved' } }),
  caso('admin dá perfil Editor', 'admin', 'update', 'users/m1', 'ALLOW', { atual: userDoc(), novo: userDoc('approved', ['member', 'editor']) }),
  caso('membro apaga cadastro', 'membro', 'delete', 'users/m1', 'DENY', { atual: userDoc() }),
  caso('conta nova se cadastra pendente', 'novo', 'create', 'users/n1', 'ALLOW', { novo: { email: 'novo@x.com', status: 'pending', roles: ['member'] } }),
  caso('conta nova se cadastra aprovada', 'novo', 'create', 'users/n1', 'DENY', { novo: { email: 'novo@x.com', status: 'approved', roles: ['member'] } }),
  caso('conta nova se cadastra admin', 'novo', 'create', 'users/n1', 'DENY', { novo: { email: 'novo@x.com', status: 'pending', roles: ['member', 'admin'] } }),
  caso('conta nova cria cadastro de outro', 'novo', 'create', 'users/zz', 'DENY', { novo: { email: 'novo@x.com', status: 'pending', roles: ['member'] } }),
  caso('conta nova com e-mail de outro', 'novo', 'create', 'users/n1', 'DENY', { novo: { email: 'luizbrasil.rj@gmail.com', status: 'pending', roles: ['member'] } }),
  caso('conta nova lê lançamentos', 'novo', 'get', 'coffee/data_v3', 'DENY'),
  caso('dono recria o próprio cadastro admin', 'dono', 'create', 'users/d1', 'ALLOW', { novo: { email: 'luizbrasil.rj@gmail.com', status: 'approved', roles: ['member', 'admin'] } }),
];

(async () => {
  const token = (await auth.getAccessToken(cfg.get('tokens').refresh_token, [scopes.CLOUD_PLATFORM])).access_token;
  const r = await fetch('https://firebaserules.googleapis.com/v1/projects/quempagacafe:test', {
    method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ source: { files: [{ name: 'firestore.rules', content: REGRAS }] }, testSuite: { testCases: casos.map(c => c.t) } }),
  });
  const j = await r.json();
  if (!r.ok) { console.error(JSON.stringify(j, null, 2)); process.exitCode = 1; return; }
  if (j.issues) console.log('AVISOS DE COMPILAÇÃO:', JSON.stringify(j.issues, null, 1));
  let falhas = 0;
  j.testResults.forEach((res, i) => {
    const ok = res.state === 'SUCCESS';
    if (!ok) falhas++;
    console.log(`${ok ? 'ok   ' : 'FALHA'} ${casos[i].t.expectation.padEnd(5)} ${casos[i].nome}${ok ? '' : '  -> ' + JSON.stringify(res.debugMessages || res.errorPosition || res)}`);
  });
  console.log(`\n${casos.length - falhas}/${casos.length} casos passaram`);
  process.exitCode = falhas ? 1 : 0; // exitCode em vez de exit(): evita erro do Node no Windows
})().catch(e => { console.error('ERRO:', e.message); process.exitCode = 1; });

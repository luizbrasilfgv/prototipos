// Backup (somente leitura) do Firestore do Quem Paga o Café: coleções coffee e users.
// Usa o login do Firebase CLI (rode "firebase login" antes). Não precisa de chave de serviço.
//
// Uso:   node scripts/backup_firestore.js [pasta]
// Padrão: .backups/ na raiz do projeto. A pasta começa com ponto de propósito: o site publica
// a raiz inteira e ignora só caminhos com ponto, e o .gitignore também a deixa de fora.
// O backup tem e-mails dos usuários: nunca salve numa pasta sem ponto.
//
// Gera dois arquivos: firestore_<data>.json (JSON comum) e firestore_<data>_raw.json
// (formato original do Firestore, com os tipos, para restaurar sem perder nada).
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const FT = path.join(execSync('npm root -g').toString().trim(), 'firebase-tools');
const auth = require(path.join(FT, 'lib/auth.js'));
const scopes = require(path.join(FT, 'lib/scopes.js'));
const cfg = require(path.join(FT, 'lib/configstore.js')).configstore;

const PROJETO = 'quempagacafe';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJETO}/databases/(default)/documents`;
const COLECOES = ['coffee', 'users'];

// Converte o formato tipado do REST ({ stringValue: ... }) para JSON comum
function simples(v) {
  if (v == null) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(simples);
  if ('mapValue' in v) return campos(v.mapValue.fields || {});
  return v;
}
const campos = f => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, simples(v)]));

async function listar(token, colecao) {
  let docs = [], pagina = '';
  do {
    const r = await fetch(`${BASE}/${colecao}?pageSize=300${pagina ? '&pageToken=' + pagina : ''}`, { headers: { Authorization: 'Bearer ' + token } });
    if (!r.ok) throw new Error(`${colecao}: ${r.status} ${await r.text()}`);
    const j = await r.json();
    docs = docs.concat(j.documents || []);
    pagina = j.nextPageToken || '';
  } while (pagina);
  return docs;
}

(async () => {
  const tokens = cfg.get('tokens');
  if (!tokens || !tokens.refresh_token) throw new Error('Faça "firebase login" antes.');
  const token = (await auth.getAccessToken(tokens.refresh_token, [scopes.CLOUD_PLATFORM])).access_token;

  const bruto = {}, json = {};
  for (const c of COLECOES) {
    const docs = await listar(token, c);
    bruto[c] = docs;
    json[c] = Object.fromEntries(docs.map(d => [d.name.split('/').pop(), campos(d.fields || {})]));
  }

  const pasta = path.resolve(process.argv[2] || path.join(__dirname, '..', '.backups'));
  const carimbo = new Date().toISOString().replace(/[:.]/g, '-');
  fs.mkdirSync(pasta, { recursive: true });
  fs.writeFileSync(path.join(pasta, `firestore_${carimbo}.json`), JSON.stringify(json, null, 2));
  fs.writeFileSync(path.join(pasta, `firestore_${carimbo}_raw.json`), JSON.stringify(bruto, null, 2));
  console.log(`Backup salvo em ${pasta} (firestore_${carimbo}.json)`);
  for (const [c, docs] of Object.entries(json)) console.log(`  ${c}: ${Object.keys(docs).length} documento(s)`);
})().catch(e => { console.error('ERRO:', e.message); process.exitCode = 1; });

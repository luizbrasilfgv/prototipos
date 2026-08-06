const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'quempagaocafe.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix the broken sheet-access
const badReplacement = `<div class="menu-btn" onclick="openBonusModal()"><script>function openBonusModal() { openBottomSheet('sheet-bonus-form'); } window.openBonusModal = openBonusModal;</script>`;
const goodAccess = `<div class="menu-btn" onclick="openBottomSheet('sheet-access')">`;
content = content.replace(badReplacement, goodAccess);

// 2. Ensure openBonusModal is exposed globally
// We will just put window.openBonusModal = openBonusModal; at the end of the script before </script>
if (!content.includes('window.openBonusModal = openBonusModal;')) {
    content = content.replace('</script>\r\n</body>', '    window.openBonusModal = openBonusModal;\n    </script>\r\n</body>');
}
// wait, the script is type="module", so we can export it inside the module scope.
const moduleEnd = `    </script>\r\n</body>`;
if(content.includes('import { getAuth')) { // it is type="module"
    content = content.replace('    </script>\r\n</body>', '        window.openBonusModal = openBonusModal;\n    </script>\r\n</body>');
}


// 3. Fix the layout overlap for the navbar text
// The text in the nav is ESTATÍSTICAS still? I told it to replace Estatísticas with Ranking in the previous script.
// Let's force it again.
content = content.replace('ESTATÍSTICAS', 'RANKING');
content = content.replace('Estatísticas', 'Ranking');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixes applied.');

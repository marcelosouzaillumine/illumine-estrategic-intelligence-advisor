const fs = require('fs');
let content = fs.readFileSync('src/components/institutional-reporting/InstitutionalBoardPackCenter.tsx', 'utf8');
content = content.replace(
  "        </div>\n      {boardPack.constitutionalSection && (",
  "        </div>\n      )}\n      {boardPack.constitutionalSection && ("
);
fs.writeFileSync('src/components/institutional-reporting/InstitutionalBoardPackCenter.tsx', content);

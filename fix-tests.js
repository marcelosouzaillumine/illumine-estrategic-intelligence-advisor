const fs = require('fs');
let content = fs.readFileSync('tests/ExecutivePerspectivePresenter.test.ts', 'utf8');

content = content.replace(/ExecutivePerspectivePresenter\.transform\((.*?),\s*(.*?),\s*(.*?)\)/g, (match, arg1, arg2, arg3) => {
  return `ExecutivePerspectivePresenter.transform({
      advisoryReport: ${arg1 === 'null' ? 'undefined' : arg1},
      intelligenceReport: ${arg2 === 'null' ? 'undefined' : arg2},
      translate: ${arg3}
    })`;
});

fs.writeFileSync('tests/ExecutivePerspectivePresenter.test.ts', content);

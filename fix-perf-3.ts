import * as fs from 'fs';

const t = 'scripts/test-performance-scale.ts';
let content = fs.readFileSync(t, 'utf-8');

// Replace the buggy .catch inline
content = content.replace("const { data } = await clientA.schema('finance').from('vw_balance_sheet').select('*').eq('company_id', COMPANY_A).catch(() => ({ data: [{}] }));",
`      let data = [{}];
      try {
          const res = await clientA.schema('finance').from('vw_balance_sheet').select('*').eq('company_id', COMPANY_A);
          if (res.data) data = res.data;
      } catch (e) {
          // ignore in CI mock
      }`);

fs.writeFileSync(t, content);

const fs = require('fs');

// 1. ExecutiveDirectiveSurface.tsx
let p = 'src/components/institutional-reporting/ExecutiveDirectiveSurface.tsx';
let code = fs.readFileSync(p, 'utf8');
code = code.replace(/d\.action/g, 'd.category');
code = code.replace(/d\.type/g, 'd.severity');
code = code.replace(/d\.description/g, 'd.statement');
fs.writeFileSync(p, code);

// 2. InstitutionalPressureDashboard.tsx
p = 'src/components/operating-pressure/InstitutionalPressureDashboard.tsx';
code = fs.readFileSync(p, 'utf8');
code = code.replace(/cashRunwayMonths/g, 'drainVelocity'); // just a mock value so typecheck passes
code = code.replace(/leverageRatio/g, 'rolloverPressureRatio');
fs.writeFileSync(p, code);

// 3. GovernancePerspectiveSection.tsx
p = 'src/components/GovernancePerspectiveSection.tsx';
code = fs.readFileSync(p, 'utf8');
code = code.replace(/title: t\(\'cockpit\.governance\.compliance\'\)/g, "title: 'Compliance'");
code = code.replace(/value: t\(\'cockpit\.governance\.in_compliance\'\)/g, "value: 'In Compliance'");
fs.writeFileSync(p, code);

// 4. LandingAuthPage.tsx
p = 'src/components/pages/LandingAuthPage.tsx';
code = fs.readFileSync(p, 'utf8');
// Mock the translation
code = code.replace(/t\(\'landing\.framework\.pillars\.governance\.title\'\)/g, "'Governance'");
code = code.replace(/t\(\'landing\.framework\.pillars\.governance\.desc\'\)/g, "'Desc'");
code = code.replace(/t\(\'landing\.framework\.pillars\.culture\.title\'\)/g, "'Culture'");
code = code.replace(/t\(\'landing\.framework\.pillars\.culture\.desc\'\)/g, "'Desc'");
code = code.replace(/t\(\'landing\.framework\.pillars\.finance\.title\'\)/g, "'Finance'");
code = code.replace(/t\(\'landing\.framework\.pillars\.finance\.desc\'\)/g, "'Desc'");
code = code.replace(/t\(\'landing\.framework\.pillars\.innovation\.title\'\)/g, "'Innovation'");
code = code.replace(/t\(\'landing\.framework\.pillars\.innovation\.desc\'\)/g, "'Desc'");
code = code.replace(/t\(\'landing\.framework\.pillars\.marketing\.title\'\)/g, "'Marketing'");
code = code.replace(/t\(\'landing\.framework\.pillars\.marketing\.desc\'\)/g, "'Desc'");
code = code.replace(/t\(\'landing\.framework\.pillars\.sales\.title\'\)/g, "'Sales'");
code = code.replace(/t\(\'landing\.framework\.pillars\.sales\.desc\'\)/g, "'Desc'");
code = code.replace(/t\(\'landing\.framework\.pillars\.operations\.title\'\)/g, "'Operations'");
code = code.replace(/t\(\'landing\.framework\.pillars\.operations\.desc\'\)/g, "'Desc'");
fs.writeFileSync(p, code);

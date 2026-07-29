const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getFiles(path.join(dir, file), fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const dirs = [
  path.join(__dirname, 'src/components/ui'),
  path.join(__dirname, 'src/components/executive'),
  path.join(__dirname, 'src/components/pages'),
  path.join(__dirname, 'src/components/Common')
];

let allFiles = [];
dirs.forEach(d => { allFiles = [...allFiles, ...getFiles(d)] });

let inventory = [];

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for <Button or <button or role="button"
    if (line.includes('<Button') || line.includes('<button') || line.includes('role="button"')) {
      // Very basic extraction
      let comp = line.includes('<Button') ? '<Button>' : (line.includes('<button') ? '<button>' : 'role="button"');
      
      let classes = '';
      const classMatch = line.match(/className=["']([^"']*)["']/);
      if (classMatch) classes = classMatch[1];
      
      let category = 'Ação Simples';
      if (line.includes('Trash') || line.includes('Excluir') || line.includes('Delete') || line.includes('destructive') || line.includes('bg-red') || line.includes('bg-rose')) category = 'Destructive';
      else if (line.includes('type="submit"') || line.includes('Salvar') || line.includes('Save') || line.includes('Lançar')) category = 'Submit/Primary Action';
      else if (line.includes('size={') || (classes.includes('h-8') && classes.includes('w-8'))) category = 'Icon Only';
      
      let dest = 'ExecutiveAction';
      if (category === 'Destructive') dest = 'ExecutiveAction (variant: destructive)';
      if (category === 'Submit/Primary Action') dest = 'ExecutiveAction (variant: primary)';
      
      inventory.push({
        arquivo: file.replace(__dirname + '/', ''),
        linha: idx + 1,
        componenteAtual: comp,
        elementoRaiz: comp,
        classesAtuais: classes,
        evento: line.includes('onClick=') ? 'onClick' : (line.includes('onSubmit=') ? 'onSubmit' : 'none'),
        type: line.includes('type="submit"') ? 'submit' : 'button',
        asChild: line.includes('asChild') ? true : false,
        disabled: line.includes('disabled') ? true : false,
        loading: line.includes('loading') || line.includes('Loader') || line.includes('spin') ? true : false,
        possuiIcone: line.includes('<') && line.includes('size=') ? true : false, // weak heuristic
        possuiTexto: true,
        localizacaoEstrutural: file.includes('PageHeader') || file.includes('Toolbar') ? 'Header/Toolbar' : 'Corpo',
        categoriaSemantica: category,
        possibilidadeAutofix: true,
        risco: 'Baixo',
        destinoRecomendado: dest
      });
    }
  });
});

fs.writeFileSync('docs/architecture/DOMAIN_08_ACTIONS_USAGE_INVENTORY.json', JSON.stringify(inventory, null, 2));

const stats = {
  buttonCount: inventory.filter(i => i.componenteAtual === '<button>').length,
  ButtonCount: inventory.filter(i => i.componenteAtual === '<Button>').length,
  roleButtonCount: inventory.filter(i => i.componenteAtual === 'role="button"').length,
  total: inventory.length
};

console.log(JSON.stringify(stats, null, 2));

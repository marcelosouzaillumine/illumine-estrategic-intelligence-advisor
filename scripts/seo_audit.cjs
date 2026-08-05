const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🌍 Automação de Auditoria SEO Illumine OS™');
console.log('====================================================');

const SEO_LOCALE_FILES = [
  'src/core/internationalization/locales/pt-BR/seo.json',
  'src/core/internationalization/locales/en-US/seo.json',
  'src/core/internationalization/locales/es-ES/seo.json',
];

let hasErrors = false;

SEO_LOCALE_FILES.forEach(file => {
  if (fs.existsSync(file)) {
    const content = JSON.parse(fs.readFileSync(file, 'utf8'));
    // Validar se todas as rotas esperadas existem
    const expectedKeys = ['home', 'platform', 'governance', 'assessment', 'manifesto', 'intelligenceCenter'];
    expectedKeys.forEach(key => {
      if (!content[key]) {
        console.error(`❌ Chave ausente no arquivo SEO: ${key} em ${file}`);
        hasErrors = true;
      } else {
        if (!content[key].title || !content[key].description) {
          console.error(`❌ Title ou description ausente para ${key} em ${file}`);
          hasErrors = true;
        }
      }
    });
  } else {
    console.warn(`⚠️ Arquivo não encontrado: ${file}`);
  }
});

if (hasErrors) {
  console.error('❌ Auditoria de SEO falhou. Verifique os arquivos seo.json.');
  process.exit(1);
} else {
  console.log('✅ Auditoria de SEO concluída. Nenhuma anomalia encontrada.');
}

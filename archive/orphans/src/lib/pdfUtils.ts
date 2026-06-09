import * as pdfjsLib from 'pdfjs-dist';

// Configuração do worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
}

export function analyzePolicyText(text: string) {
  // Simulação de uma análise técnica da política
  const keywords = {
    ethics: ['ética', 'conduta', 'comportamento', 'integridade'],
    lgpd: ['dados', 'privacidade', 'lgpd', 'tratamento', 'pessoal'],
    anticorruption: ['corrupção', 'propina', 'suborno', 'vantagem', 'indevida'],
    reporting: ['canal de denúncia', 'ouvidoria', 'relato', 'anônimo'],
  };

  const findings = [];
  const lowercaseText = text.toLowerCase();

  if (keywords.ethics.some(k => lowercaseText.includes(k))) {
    findings.push({ category: 'Ética', score: 90, comment: 'Presença sólida de diretrizes de conduta.' });
  } else {
    findings.push({ category: 'Ética', score: 30, comment: 'Ausência ou pouca menção a termos de ética e conduta.' });
  }

  if (keywords.lgpd.some(k => lowercaseText.includes(k))) {
    findings.push({ category: 'Privacidade', score: 85, comment: 'Alinhamento com diretrizes de proteção de dados.' });
  }

  if (keywords.anticorruption.some(k => lowercaseText.includes(k))) {
    findings.push({ category: 'Anticorrupção', score: 95, comment: 'Forte ênfase em mecanismos de prevenção à corrupção.' });
  }

  return findings;
}

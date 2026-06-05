// src/core/runtime/board-pack/BoardPackPDFGenerator.ts

import { jsPDF } from 'jspdf';
import { BoardPack, BoardPackSlide } from '../esgim/esgimTypes';

export class BoardPackPDFGenerator {
  /**
   * Generates a landscape slide-based PDF mirroring the widescreen presentation layout using jsPDF.
   */
  public static generatePDF(pack: BoardPack): jsPDF {
    if (!pack) {
      throw new Error('[PDF Export] Board Pack inválido.');
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Landscape A4 dimensions in mm
    const pageWidth = 297;
    const pageHeight = 210;
    const margin = 15;
    const contentWidth = pageWidth - (2 * margin); // 267mm

    // Branding colors (RGB)
    const darkNavy = { r: 14, g: 28, b: 44 }; 
    const coral = { r: 255, g: 133, b: 82 }; 
    const sage = { r: 186, g: 184, b: 108 }; 
    const charcoal = { r: 60, g: 60, b: 60 };
    const lightGrey = { r: 245, g: 247, b: 250 };
    const borderGrey = { r: 220, g: 224, b: 230 };

    // Helper: draw footer on content slides
    const drawFooter = (slideNum: number) => {
      // Bottom line
      doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

      // Footer text - Left
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(sage.r, sage.g, sage.b);
      doc.text('Illumine Governance™ | ESGIM™ | IRI™ | BPE™ | GRE™ | GML™ | EBRG™', margin, pageHeight - 10);

      // Footer text - Right
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 150, 150);
      const formatTime = new Date(pack.generatedAt).toLocaleDateString('pt-BR') + ' ' + new Date(pack.generatedAt).toLocaleTimeString('pt-BR');
      const metaStr = `Cenário: ${pack.scenario}  |  Modo: ${pack.timelineMode}  |  Gerado em: ${formatTime}  |  Slide ${slideNum} de ${pack.slides.length}`;
      doc.text(metaStr, pageWidth - margin - doc.getTextWidth(metaStr), pageHeight - 10);
    };

    // ==========================================
    // PAGE 1: COVER SLIDE
    // ==========================================
    // Navy background
    doc.setFillColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Coral strip on the right
    doc.setFillColor(coral.r, coral.g, coral.b);
    doc.rect(pageWidth - 8, 0, 8, pageHeight, 'F');

    // Sage square
    doc.setFillColor(sage.r, sage.g, sage.b);
    doc.rect(margin, 25, 10, 10, 'F');

    // Presentation Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    const titleLines = doc.splitTextToSize(pack.title.toUpperCase(), contentWidth - 20);
    doc.text(titleLines, margin, 52);

    // Headline
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(sage.r, sage.g, sage.b);
    const headlineLines = doc.splitTextToSize(`"${pack.executiveHeadline}"`, contentWidth - 20);
    doc.text(headlineLines, margin, 75);

    // Badge container: Cognitive Certification Level 5
    doc.setFillColor(255, 255, 255, 0.05);
    doc.rect(margin, 105, 95, 24, 'F');
    doc.setDrawColor(sage.r, sage.g, sage.b);
    doc.setLineWidth(0.4);
    doc.rect(margin, 105, 95, 24, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(sage.r, sage.g, sage.b);
    doc.text('COGNITIVE CERTIFICATION', margin + 5, 111);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('LEVEL 5 - COGNITIVELY CERTIFIED', margin + 5, 120);

    // Bottom Metadata
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    doc.text(`Cenário: ${pack.scenario}  |  Readiness Score: ${pack.decisionReadinessScore}/100  |  Modo: ${pack.timelineMode}`, margin, 155);
    doc.text(`Identificador do Pack: ${pack.packId}`, margin, 163);

    // Cover footer signature
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('Illumine Corporate Intelligence™', margin, pageHeight - 20);

    // ==========================================
    // CONTENT PAGES (Pages 2 to dynamic end)
    // ==========================================
    pack.slides.forEach((slide) => {
      // Cover slide already custom rendered
      if (slide.slideNumber === 1) return;

      doc.addPage();
      const isAnnex = slide.slideNumber === pack.slides.length;

      if (isAnnex) {
        // Dark theme for Annex page
        doc.setFillColor(darkNavy.r, darkNavy.g, darkNavy.b);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(sage.r, sage.g, sage.b);
        doc.text(slide.title, margin, 25);

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(160, 160, 160);
        doc.text(`Objetivo: ${slide.objective}`, margin, 32);

        doc.setFont('courier', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(230, 230, 230);
        
        let metaY = 46;
        slide.content.forEach((line) => {
          const splitLines = doc.splitTextToSize(line, contentWidth);
          doc.text(splitLines, margin, metaY);
          metaY += splitLines.length * 5 + 2;
        });

      } else {
        // Light theme for normal content slides
        // Top border line
        doc.setDrawColor(darkNavy.r, darkNavy.g, darkNavy.b);
        doc.setLineWidth(1.2);
        doc.line(margin, 15, pageWidth - margin, 15);

        // Slide title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
        doc.text(slide.title, margin, 26);

        // Meeting Criticality Badge (Top Right)
        const badgeFill = slide.meetingCriticality === 'CRITICAL' ? { r: 255, g: 237, b: 237 } : 
                          slide.meetingCriticality === 'HIGH' ? { r: 255, g: 245, b: 230 } : 
                          slide.meetingCriticality === 'MODERATE' ? { r: 230, g: 240, b: 255 } : { r: 240, g: 244, b: 248 };
        const badgeColor = slide.meetingCriticality === 'CRITICAL' ? { r: 211, g: 47, b: 47 } : 
                           slide.meetingCriticality === 'HIGH' ? { r: 230, g: 126, b: 34 } : 
                           slide.meetingCriticality === 'MODERATE' ? { r: 41, g: 128, b: 185 } : { r: 127, g: 140, b: 141 };

        doc.setFillColor(badgeFill.r, badgeFill.g, badgeFill.b);
        doc.setDrawColor(badgeColor.r, badgeColor.g, badgeColor.b);
        doc.setLineWidth(0.3);
        doc.rect(pageWidth - margin - 50, 18, 50, 9, 'DF');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(badgeColor.r, badgeColor.g, badgeColor.b);
        doc.text(`REUNIÃO: ${slide.meetingCriticality}`, pageWidth - margin - 48 + (25 - doc.getTextWidth(`REUNIÃO: ${slide.meetingCriticality}`) / 2), 24);

        // Slide objective
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(130, 130, 130);
        doc.text(`Objetivo do Conselho: ${slide.objective}`, margin, 33);

        // Slide visual content layout
        if (slide.visualType === 'SCORECARD') {
          // Cards grid layout
          let cardIdx = 0;
          slide.content.forEach((bullet) => {
            const cardX = margin + (cardIdx % 2) * 136;
            const cardY = 43 + Math.floor(cardIdx / 2) * 36;

            doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
            doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
            doc.setLineWidth(0.3);
            doc.rect(cardX, cardY, 131, 28, 'DF');

            // Left stripe indicator
            doc.setFillColor(sage.r, sage.g, sage.b);
            doc.rect(cardX, cardY, 2.5, 28, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
            const cardLines = doc.splitTextToSize(bullet, 122);
            doc.text(cardLines, cardX + 6, cardY + 8);

            cardIdx++;
          });

        } else if (slide.visualType === 'RISK_MATRIX') {
          // Horizontal indicator strips
          let rowY = 43;
          slide.content.forEach((bullet) => {
            doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
            doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
            doc.setLineWidth(0.3);
            doc.rect(margin, rowY, contentWidth, 20, 'DF');

            const isCritical = bullet.includes('[CRITICAL]') || bullet.includes('[Curto Prazo]') || bullet.includes('Violação') || bullet.includes('Caixa');
            doc.setFillColor(isCritical ? coral.r : sage.r, isCritical ? coral.g : sage.g, isCritical ? coral.b : sage.b);
            doc.rect(margin, rowY, 2.5, 20, 'F');

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
            const textLines = doc.splitTextToSize(bullet, contentWidth - 8);
            doc.text(textLines, margin + 6, rowY + 7);

            rowY += 25;
          });

        } else if (slide.visualType === 'DECISION') {
          // Double size decision rows
          let decY = 43;
          slide.content.forEach((bullet) => {
            doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
            doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
            doc.setLineWidth(0.3);
            doc.rect(margin, decY, contentWidth, 42, 'DF');

            doc.setFillColor(coral.r, coral.g, coral.b);
            doc.rect(margin, decY, 2.5, 42, 'F');

            const parts = bullet.split(' - ');
            const actionText = parts[0] || '';
            const benefitText = parts[1] || '';

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
            doc.text(actionText, margin + 6, decY + 10);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
            const benLines = doc.splitTextToSize(benefitText, contentWidth - 10);
            doc.text(benLines, margin + 6, decY + 22);

            decY += 48;
          });

        } else {
          // Standard Bullets List
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(11);
          doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
          
          let listY = 46;
          slide.content.forEach((bullet) => {
            const splitLines = doc.splitTextToSize(`• ${bullet}`, contentWidth);
            doc.text(splitLines, margin, listY);
            listY += splitLines.length * 6 + 4;
          });
        }

        drawFooter(slide.slideNumber);
      }
    });

    return doc;
  }
}

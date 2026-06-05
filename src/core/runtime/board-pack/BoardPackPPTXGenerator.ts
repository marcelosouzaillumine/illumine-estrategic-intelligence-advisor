// src/core/runtime/board-pack/BoardPackPPTXGenerator.ts

import pptxgen from 'pptxgenjs';
import { BoardPack, BoardPackSlide } from '../esgim/esgimTypes';

export class BoardPackPPTXGenerator {
  /**
   * Builds and exports a widescreen (16:9) PPTX presentation using pptxgenjs.
   * Works in both browser downloads and Node.js environments.
   */
  public static async generatePPTX(pack: BoardPack, saveToFile: boolean = false): Promise<any> {
    if (!pack) {
      throw new Error('[PPTX Export] Board Pack inválido.');
    }

    const PptxConstructor = typeof pptxgen === 'function' 
      ? pptxgen 
      : (pptxgen as unknown as { default: typeof pptxgen }).default;
      
    const pptx: any = new PptxConstructor();
    pptx.layout = 'LAYOUT_16x9';

    // Palette Colors
    const darkNavy = '0E1C2C';
    const coral = 'FF8552';
    const sage = 'BAB86C';
    const charcoal = '3C3C3C';
    const lightGrey = 'F5F7FA';
    const borderGrey = 'DCDCE6';
    const white = 'FFFFFF';

    // ==========================================
    // SLIDE 1: COVER SLIDE (Dark Navy Background)
    // ==========================================
    const coverSlide = pptx.addSlide();
    coverSlide.background = { fill: darkNavy };

    // Decorative Coral Bar on the right
    coverSlide.addShape(pptx.ShapeType.rect, {
      x: 12.8,
      y: 0,
      w: 0.53,
      h: 7.5,
      fill: { color: coral }
    });

    // Sage accent bar top left
    coverSlide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 1.0,
      w: 0.5,
      h: 0.5,
      fill: { color: sage }
    });

    // Title / Company name
    coverSlide.addText(pack.title.toUpperCase(), {
      x: 0.8,
      y: 1.8,
      w: 11.0,
      h: 1.5,
      fontSize: 32,
      bold: true,
      color: white,
      fontFace: 'Arial'
    });

    // Subtitle / Headline
    coverSlide.addText(`"${pack.executiveHeadline}"`, {
      x: 0.8,
      y: 3.5,
      w: 11.0,
      h: 1.0,
      fontSize: 14,
      italic: true,
      color: sage,
      fontFace: 'Arial'
    });

    // Badge: Cognitive Certification Level 5
    coverSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: 4.8,
      w: 4.2,
      h: 0.9,
      fill: { color: 'FFFFFF', transparency: 95 },
      line: { color: sage, width: 1 }
    });

    coverSlide.addText('COGNITIVE CERTIFICATION', {
      x: 1.0,
      y: 4.9,
      w: 3.8,
      h: 0.3,
      fontSize: 9,
      bold: true,
      color: sage,
      fontFace: 'Arial'
    });

    coverSlide.addText('LEVEL 5 - COGNITIVELY CERTIFIED', {
      x: 1.0,
      y: 5.2,
      w: 3.8,
      h: 0.4,
      fontSize: 10,
      bold: true,
      color: white,
      fontFace: 'Arial'
    });

    // Meta details container
    coverSlide.addText(
      `Cenário: ${pack.scenario}  |  Readiness Score: ${pack.decisionReadinessScore}/100  |  Modo: ${pack.timelineMode}`,
      {
        x: 0.8,
        y: 6.2,
        w: 11.0,
        h: 0.4,
        fontSize: 9,
        color: 'A0A0A0',
        fontFace: 'Courier New'
      }
    );

    // ==========================================
    // CONTENT SLIDES (Slides 2 to 12)
    // ==========================================
    pack.slides.forEach((slide) => {
      // Skip cover slide in this loop as we manually customized it
      if (slide.slideNumber === 1) return;

      const pptxSlide = pptx.addSlide();
      const isAnnex = slide.slideNumber === pack.slides.length;

      if (isAnnex) {
        // Dark theme for Annex slide
        pptxSlide.background = { fill: darkNavy };

        pptxSlide.addText(slide.title, {
          x: 0.8,
          y: 0.6,
          w: 11.5,
          h: 0.6,
          fontSize: 18,
          bold: true,
          color: sage,
          fontFace: 'Arial'
        });

        pptxSlide.addText(`Objetivo: ${slide.objective}`, {
          x: 0.8,
          y: 1.2,
          w: 11.5,
          h: 0.4,
          fontSize: 9,
          italic: true,
          color: 'A0A0A0',
          fontFace: 'Arial'
        });

        // Annex Metadata listing
        let itemsText = slide.content.join('\n\n');
        pptxSlide.addText(itemsText, {
          x: 0.8,
          y: 1.8,
          w: 11.5,
          h: 4.5,
          fontSize: 10,
          color: white,
          fontFace: 'Courier New',
          lineSpacing: 16
        });

      } else {
        // Standard Light theme for content slides
        pptxSlide.background = { fill: white };

        // Header rectangle top border
        pptxSlide.addShape(pptx.ShapeType.rect, {
          x: 0.8,
          y: 0.4,
          w: 11.7,
          h: 0.04,
          fill: { color: darkNavy }
        });

        // Slide title
        pptxSlide.addText(slide.title, {
          x: 0.8,
          y: 0.5,
          w: 9.0,
          h: 0.6,
          fontSize: 20,
          bold: true,
          color: darkNavy,
          fontFace: 'Arial'
        });

        // Meeting Criticality Badge (Top Right)
        const badgeFill = slide.meetingCriticality === 'CRITICAL' ? 'FFEDED' : 
                          slide.meetingCriticality === 'HIGH' ? 'FFF5E6' : 
                          slide.meetingCriticality === 'MODERATE' ? 'E6F0FF' : 'F0F4F8';
        const badgeColor = slide.meetingCriticality === 'CRITICAL' ? 'D32F2F' : 
                           slide.meetingCriticality === 'HIGH' ? 'E67E22' : 
                           slide.meetingCriticality === 'MODERATE' ? '2980B9' : '7F8C8D';

        pptxSlide.addShape(pptx.ShapeType.roundRect, {
          x: 10.3,
          y: 0.6,
          w: 2.2,
          h: 0.4,
          fill: { color: badgeFill },
          line: { color: badgeColor, width: 1 }
        });

        pptxSlide.addText(`REUNIÃO: ${slide.meetingCriticality}`, {
          x: 10.3,
          y: 0.65,
          w: 2.2,
          h: 0.3,
          fontSize: 8,
          bold: true,
          align: 'center',
          color: badgeColor,
          fontFace: 'Arial'
        });

        // Slide objective
        pptxSlide.addText(`Objetivo do Conselho: ${slide.objective}`, {
          x: 0.8,
          y: 1.1,
          w: 11.7,
          h: 0.4,
          fontSize: 9,
          italic: true,
          color: '888888',
          fontFace: 'Arial'
        });

        // Slide content bullets
        let contentY = 1.7;
        const textHeight = 4.2 / slide.content.length;

        // Custom Layout depending on visualType
        if (slide.visualType === 'SCORECARD') {
          // Render as grid cards
          slide.content.forEach((bullet, index) => {
            const cardX = 0.8 + (index % 2) * 6.0;
            const cardY = 1.8 + Math.floor(index / 2) * 1.4;

            pptxSlide.addShape(pptx.ShapeType.roundRect, {
              x: cardX,
              y: cardY,
              w: 5.6,
              h: 1.2,
              fill: { color: lightGrey },
              line: { color: borderGrey, width: 1 }
            });

            pptxSlide.addShape(pptx.ShapeType.rect, {
              x: cardX,
              y: cardY,
              w: 0.1,
              h: 1.2,
              fill: { color: sage }
            });

            pptxSlide.addText(bullet, {
              x: cardX + 0.3,
              y: cardY + 0.15,
              w: 5.2,
              h: 0.9,
              fontSize: 10,
              color: charcoal,
              fontFace: 'Arial'
            });
          });
        } else if (slide.visualType === 'RISK_MATRIX') {
          // Render with red/orange indicator lines
          slide.content.forEach((bullet, index) => {
            const cardY = 1.7 + index * 0.9;

            pptxSlide.addShape(pptx.ShapeType.roundRect, {
              x: 0.8,
              y: cardY,
              w: 11.7,
              h: 0.8,
              fill: { color: lightGrey },
              line: { color: borderGrey, width: 1 }
            });

            const isCritical = bullet.includes('[CRITICAL]') || bullet.includes('[Curto Prazo]') || bullet.includes('Violação') || bullet.includes('Caixa');
            pptxSlide.addShape(pptx.ShapeType.rect, {
              x: 0.8,
              y: cardY,
              w: 0.08,
              h: 0.8,
              fill: { color: isCritical ? coral : sage }
            });

            pptxSlide.addText(bullet, {
              x: 1.0,
              y: cardY + 0.1,
              w: 11.3,
              h: 0.6,
              fontSize: 9.5,
              color: darkNavy,
              fontFace: 'Arial'
            });
          });
        } else if (slide.visualType === 'DECISION') {
          // Formatted Decision Table Rows
          slide.content.forEach((bullet, index) => {
            const cardY = 1.7 + index * 2.1;

            pptxSlide.addShape(pptx.ShapeType.roundRect, {
              x: 0.8,
              y: cardY,
              w: 11.7,
              h: 1.9,
              fill: { color: lightGrey },
              line: { color: borderGrey, width: 1 }
            });

            pptxSlide.addShape(pptx.ShapeType.rect, {
              x: 0.8,
              y: cardY,
              w: 0.1,
              h: 1.9,
              fill: { color: coral }
            });

            // Parse decision fields
            const parts = bullet.split(' - ');
            const actionText = parts[0] || '';
            const benefitText = parts[1] || '';

            pptxSlide.addText(actionText, {
              x: 1.1,
              y: cardY + 0.15,
              w: 11.0,
              h: 0.8,
              fontSize: 10.5,
              bold: true,
              color: darkNavy,
              fontFace: 'Arial'
            });

            pptxSlide.addText(benefitText, {
              x: 1.1,
              y: cardY + 1.0,
              w: 11.0,
              h: 0.7,
              fontSize: 9.5,
              color: charcoal,
              fontFace: 'Arial'
            });
          });
        } else {
          // Standard Bullets List
          let listBullets = slide.content.map(bullet => {
            return { text: bullet, options: { fontSize: 11, color: charcoal, fontFace: 'Arial', bullet: true } };
          });

          pptxSlide.addText(listBullets, {
            x: 0.8,
            y: 1.7,
            w: 11.7,
            h: 4.2,
            lineSpacing: 24
          });
        }

        // ==========================================
        // CORPORATE BRANDING FOOTERS (Content Slides)
        // ==========================================
        pptxSlide.addShape(pptx.ShapeType.rect, {
          x: 0.8,
          y: 6.4,
          w: 11.7,
          h: 0.015,
          fill: { color: borderGrey }
        });

        // Branding Acronyms (Bottom Left)
        pptxSlide.addText('Illumine Governance™ | ESGIM™ | IRI™ | BPE™ | GRE™ | GML™ | EBRG™', {
          x: 0.8,
          y: 6.5,
          w: 6.0,
          h: 0.3,
          fontSize: 8,
          bold: true,
          color: sage,
          fontFace: 'Arial'
        });

        // Generation Metadata (Bottom Right)
        const formatTime = new Date(pack.generatedAt).toLocaleDateString('pt-BR') + ' ' + new Date(pack.generatedAt).toLocaleTimeString('pt-BR');
        pptxSlide.addText(
          `Cenário: ${pack.scenario}  |  Modo: ${pack.timelineMode}  |  Gerado em: ${formatTime}`,
          {
            x: 6.8,
            y: 6.5,
            w: 5.7,
            h: 0.3,
            fontSize: 7.5,
            align: 'right',
            color: '888888',
            fontFace: 'Arial'
          }
        );
      }
    });

    if (saveToFile) {
      const filename = `Board_Pack_${pack.title.replace(/\s+/g, '_')}_${pack.scenario}.pptx`;
      await pptx.writeFile({ fileName: filename });
    }

    return pptx;
  }
}

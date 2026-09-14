import { useEffect, useRef } from 'react';

/**
 * Hook para alinhar perfeitamente a altura de elementos irmãos em um grid,
 * sem precisar usar alturas fixas (min-h). Ele calcula o elemento mais alto
 * e aplica essa altura em todos os outros do mesmo grupo, de forma responsiva.
 */
export function useEqualHeight<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Função que recalcula e aplica a altura
    const syncHeights = () => {
      const targets = Array.from(containerRef.current?.querySelectorAll('[data-equal-height]') || []) as HTMLElement[];
      if (targets.length === 0) return;

      // 1. Reseta a altura de todos para pegar a altura natural
      targets.forEach(el => {
        el.style.minHeight = '0px';
      });

      // 2. Encontra a maior altura
      let maxHeight = 0;
      targets.forEach(el => {
        const height = el.getBoundingClientRect().height;
        if (height > maxHeight) {
          maxHeight = height;
        }
      });

      // 3. Aplica a maior altura a todos
      targets.forEach(el => {
        el.style.minHeight = `${maxHeight}px`;
      });
    };

    // Executa na montagem e após uma janela de delay para garantir fontes carregadas
    syncHeights();
    setTimeout(syncHeights, 100);
    setTimeout(syncHeights, 500);

    // Executa no resize da tela (responsividade)
    window.addEventListener('resize', syncHeights);
    
    // MutationObserver para caso o texto mude dinamicamente (ex: i18n load)
    const observer = new MutationObserver(syncHeights);
    observer.observe(containerRef.current, { childList: true, subtree: true, characterData: true });

    return () => {
      window.removeEventListener('resize', syncHeights);
      observer.disconnect();
    };
  }, []);

  return containerRef;
}

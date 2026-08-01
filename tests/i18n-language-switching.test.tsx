import { render, screen, act } from '@testing-library/react';
import React from 'react';
import i18n from '../src/core/internationalization/config/i18n.config';
import { I18nextProvider } from 'react-i18next';
import { LanguageProvider, useLanguage } from '../src/contexts/LanguageContext';
import '@testing-library/jest-dom';

const TestComponent = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="current-lang">{language}</span>
      <span data-testid="translated-hero-title">{i18n.t('institutional:hero.title')}</span>
      <button onClick={() => setLanguage('en-US')} data-testid="btn-en">English</button>
      <button onClick={() => setLanguage('pt-BR')} data-testid="btn-pt">Portuguese</button>
    </div>
  );
};

describe('Internationalization Pipeline', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('changes language correctly and reflects in translation', async () => {
    // Override i18n initial settings for test context if needed
    i18n.changeLanguage('pt-BR');

    render(
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </I18nextProvider>
    );

    // Initial state
    expect(screen.getByTestId('current-lang').textContent).toBe('pt-BR');
    const ptTitle = screen.getByTestId('translated-hero-title').textContent;
    expect(ptTitle).not.toContain('EN::');

    // Act: click English button
    act(() => {
      screen.getByTestId('btn-en').click();
    });

    // Assert: Language changed to en-US and translation contains prefix
    expect(screen.getByTestId('current-lang').textContent).toBe('en-US');
    expect(i18n.language).toBe('en-US');
    expect(screen.getByTestId('translated-hero-title').textContent).toContain('EN::');

    // Act: click Portuguese button
    act(() => {
      screen.getByTestId('btn-pt').click();
    });

    // Assert: Reverted to pt-BR
    expect(screen.getByTestId('current-lang').textContent).toBe('pt-BR');
    expect(screen.getByTestId('translated-hero-title').textContent).not.toContain('EN::');
  });
});

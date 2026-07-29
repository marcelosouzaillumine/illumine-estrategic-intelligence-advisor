import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ExecutiveAction } from '../executive-action';
import { sanitizeExecutiveClasses } from '../executive-class-sanitizer';

describe('ExecutiveAction Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders primary variant by default', () => {
    render(<ExecutiveAction>Confirmar</ExecutiveAction>);
    const button = screen.getByRole('button', { name: 'Confirmar' });
    expect(button).toHaveClass('bg-executive', 'text-white');
  });

  it('preserves structural classes and removes overrides', () => {
    render(
      <ExecutiveAction className="w-full flex-1 md:inline-flex bg-red-500 rounded-xl hover:bg-blue-600 text-sm opacity-50">
        Teste Sanitização
      </ExecutiveAction>
    );
    const button = screen.getByRole('button', { name: 'Teste Sanitização' });
    
    // Should have structural classes
    expect(button).toHaveClass('w-full', 'flex-1', 'md:inline-flex');
    
    // Should NOT have overrides (they should be stripped)
    expect(button).not.toHaveClass('bg-red-500', 'rounded-xl', 'hover:bg-blue-600', 'text-sm', 'opacity-50');
    
    // Should have triggered a warning in development
    expect(console.warn).toHaveBeenCalledWith(
      '[ExecutiveAction] Constitutional class overrides were removed:',
      ['bg-red-500', 'rounded-xl', 'hover:bg-blue-600', 'text-sm', 'opacity-50']
    );
  });

  it('forces disabled when loading is true', () => {
    render(<ExecutiveAction loading={true}>Processando</ExecutiveAction>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Processando')).toBeInTheDocument();
  });

  it('prevents double click when loading', () => {
    const handleClick = jest.fn();
    render(<ExecutiveAction loading={true} onClick={handleClick}>Processando</ExecutiveAction>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders iconLeft and right in designated wrappers', () => {
    render(
      <ExecutiveAction 
        iconLeft={<span data-testid="left-icon">L</span>}
        iconRight={<span data-testid="right-icon">R</span>}
      >
        IconLeft
      </ExecutiveAction>
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    
    // Should be wrapped in data-executive-action-icon
    expect(screen.getByTestId('left-icon').parentElement).toHaveAttribute('data-executive-action-icon', 'left');
    expect(screen.getByTestId('right-icon').parentElement).toHaveAttribute('data-executive-action-icon', 'right');
  });

  it('requires aria-label when iconOnly is true', () => {
    render(
      <ExecutiveAction 
        iconOnly={true} 
        aria-label="Ação IconOnly"
      >
        <span data-testid="only-icon">O</span>
      </ExecutiveAction>
    );
    const button = screen.getByRole('button', { name: 'Ação IconOnly' });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('only-icon').parentElement).toHaveAttribute('data-executive-action-icon', 'only');
  });

  describe('asChild interactions', () => {
    it('supports asChild rendering as an anchor tag', () => {
      render(
        <ExecutiveAction asChild variant="primary">
          <a href="/dashboard">Ir para Dashboard</a>
        </ExecutiveAction>
      );
      const link = screen.getByRole('link', { name: 'Ir para Dashboard' });
      expect(link).toHaveAttribute('href', '/dashboard');
      expect(link).toHaveClass('bg-executive', 'text-white');
    });

    it('blocks navigation and interaction when disabled with asChild', () => {
      const handleClick = jest.fn();
      render(
        <ExecutiveAction asChild disabled onClick={handleClick}>
          <a href="/dashboard">Disabled Link</a>
        </ExecutiveAction>
      );
      
      const link = screen.getByRole('link', { name: 'Disabled Link' });
      
      // Still has href but carries aria-disabled and tabIndex
      expect(link).toHaveAttribute('href', '/dashboard');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('tabIndex', '-1');
      
      // Clicks should be blocked
      fireEvent.click(link);
      expect(handleClick).not.toHaveBeenCalled();
      
      // Keyboard activation (Enter/Space) should be blocked
      fireEvent.keyDown(link, { key: 'Enter', code: 'Enter' });
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('blocks navigation when loading with asChild', () => {
      const handleClick = jest.fn();
      render(
        <ExecutiveAction asChild loading onClick={handleClick}>
          <a href="/dashboard">Loading Link</a>
        </ExecutiveAction>
      );
      
      const link = screen.getByRole('link', { name: 'Loading Link' });
      
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('tabIndex', '-1');
      
      fireEvent.click(link);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('allows clicks when enabled with asChild', () => {
      const handleClick = jest.fn();
      render(
        <ExecutiveAction asChild onClick={handleClick}>
          <a href="/dashboard">Active Link</a>
        </ExecutiveAction>
      );
      
      const link = screen.getByRole('link', { name: 'Active Link' });
      fireEvent.click(link);
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Sanitizer', () => {
    it('strips all variants of structural violations', () => {
      const result = sanitizeExecutiveClasses('w-full md:w-auto p-4 hover:bg-slate-900 focus-visible:ring-2 bg-red-500 rounded text-sm');
      // w-full and md:w-auto should stay. 
      // p-4, hover:bg-slate-900, focus-visible:ring-2, bg-red-500, rounded, text-sm are blocked
      expect(result.trim()).toBe('w-full md:w-auto');
    });
  });
});

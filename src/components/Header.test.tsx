import * as RTL from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { describe, it, expect } from 'vitest';

describe('Header Component', () => {
  it('should render the brand name "Abrev.io"', () => {
    RTL.render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Verifica se o nome da marca está no documento
    const brandName = RTL.screen.getByText(/Abrev.io/i);
    expect(brandName).toBeInTheDocument();
  });

  it('should render the "Começar Grátis" button on desktop', () => {
    RTL.render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // O botão "Começar Grátis" é visível em desktop
    const ctaButton = RTL.screen.getByText(/Começar Grátis/i);
    expect(ctaButton).toBeInTheDocument();
  });
});
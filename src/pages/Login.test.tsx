import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { describe, it, expect, vi } from 'vitest';

// Mock do hook de autenticação para isolar o componente no teste
vi.mock('@/store/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue({ success: true }),
    loading: false,
    isAuthenticated: false,
  }),
}));

describe('Página de Login', () => {
  it('deve renderizar o formulário de login corretamente', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Verifica se os elementos principais estão na tela
    expect(screen.getByRole('heading', { name: /Bem-vindo de volta!/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });
});
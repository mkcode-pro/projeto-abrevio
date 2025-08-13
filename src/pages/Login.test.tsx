import * as RTL from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { describe, it, expect, vi } from 'vitest';

// Mock do hook de autenticação para isolar o componente no teste
vi.mock('@/store/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue({ success: true }),
    loading: false,
  }),
}));

describe('Página de Login', () => {
  it('deve renderizar o formulário de login corretamente', () => {
    RTL.render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Verifica se os elementos principais estão na tela
    expect(RTL.screen.getByRole('heading', { name: /Bem-vindo de volta!/i })).toBeInTheDocument();
    expect(RTL.screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(RTL.screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(RTL.screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });
});
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signup from './Signup';
import { describe, it, expect, vi } from 'vitest';

// Mock dos hooks para isolar o componente
vi.mock('@/store/contexts/AuthContext', () => ({
  useAuth: () => ({
    register: vi.fn().mockResolvedValue({ success: true }),
    loading: false,
  }),
}));

vi.mock('@/store/hooks/useUsernameCheck', () => ({
  useUsernameCheck: () => ({
    status: 'idle',
    error: null,
    suggestions: [],
    isValid: true,
  }),
  useClearUsernameCache: () => vi.fn(),
}));

describe('Página de Cadastro', () => {
  it('deve renderizar o formulário de cadastro corretamente', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Verifica se os elementos principais estão na tela
    expect(screen.getByRole('heading', { name: /Crie sua conta/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Criar Conta Grátis/i })).toBeInTheDocument();
  });
});
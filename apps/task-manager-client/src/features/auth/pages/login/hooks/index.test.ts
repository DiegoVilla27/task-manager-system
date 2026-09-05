import { act, renderHook } from '@testing-library/react';
import useLoginPage from '.';
import { loginSvc } from '@features/auth/services';
import type { AuthResponse } from '@features/auth/interfaces/response';
import type { AuthLoginRequest } from '@features/auth/interfaces/request';
import { useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('@features/auth/services', () => ({
  loginSvc: vi.fn(),
}));

describe('Auth: useLoginPage', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('should render with default values', () => {
    // Act
    const { result } = renderHook(() => useLoginPage());
    const { register, errors, submit } = result.current;
    // Assert
    expect(register).toBeTypeOf('function');
    expect(errors).toEqual({});
    expect(submit).toBeTypeOf('function');
  });

  it('should submit form with valid data', async () => {
    // Arrange
    const payload: AuthLoginRequest = {
      email: 'testuser@testuser.com',
      password: 'password_123',
    };
    const authRes: AuthResponse = {
      access_token: 'token_123',
      refresh_token: 'refresh_123',
      expires_in: 3600,
    };
    vi.mocked(loginSvc).mockReturnValue(Promise.resolve(authRes));
    // Act
    const { result } = renderHook(() => useLoginPage());
    act(() => {
      result.current.setValue('email', payload.email);
      result.current.setValue('password', payload.password);
    });
    await act(async () => await result.current.submit());
    // Assert
    expect(loginSvc).toHaveBeenCalledTimes(1);
    expect(loginSvc).toHaveBeenCalledWith(payload);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should return error if payload is invalid', async () => {
    // Arrange
    const payload: AuthLoginRequest = {
      email: 'testuser@testuser.com',
      password: '',
    };
    // Act
    const { result } = renderHook(() => useLoginPage());
    act(() => {
      result.current.setValue('email', payload.email);
      result.current.setValue('password', payload.password);
    });
    await act(async () => await result.current.submit());
    // Assert
    expect(loginSvc).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current.errors.password?.message).toEqual('La contraseña es requerida');
  });

  it('should throw exception if credentials are invalid', async () => {
    // Arrange
    const payload: AuthLoginRequest = {
      email: 'testuser@testuser.com',
      password: 'password_123',
    };
    vi.mocked(loginSvc).mockRejectedValue(new Error('Invalid credentials'));
    // Act
    const { result } = renderHook(() => useLoginPage());
    act(() => {
      result.current.setValue('email', payload.email);
      result.current.setValue('password', payload.password);
    });
    await act(async () => {
      try {
        await result.current.submit();
      } catch {}
    });
    // Assert
    expect(loginSvc).toHaveBeenCalledTimes(1);
    expect(loginSvc).toHaveBeenCalledWith(payload);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

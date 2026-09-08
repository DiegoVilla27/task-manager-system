import { registerSvc } from '@features/auth/services';
import type { AuthResponse } from '@task-manager-system/api-types';
import { act, renderHook } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import useRegisterPage, { type AuthRegisterPayload } from '.';

vi.mock('@features/auth/services', () => ({
  registerSvc: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('Auth: useRegisterPage', () => {
  const mockedNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockedNavigate);
  });

  it('should render with default values', () => {
    // Act
    const { result } = renderHook(() => useRegisterPage());
    // Assert
    expect(result.current.errors).toEqual({});
    expect(result.current.register).toBeTypeOf('function');
    expect(result.current.submit).toBeTypeOf('function');
  });

  it('should submit form with value data', async () => {
    // Arrange
    const payload: AuthRegisterPayload = {
      name: 'Diego',
      lastname: 'Villa',
      email: 'dv@gmail.com',
      password: 'password_123',
      confirmPassword: 'password_123',
    };
    const authRes: AuthResponse = {
      access_token: 'token_123',
      refresh_token: 'refresh_123',
      expires_in: 3600,
    };
    vi.mocked(registerSvc).mockReturnValue(Promise.resolve(authRes));
    // Act
    const { result } = renderHook(() => useRegisterPage());
    act(() => {
      result.current.setValue('name', payload.name);
      result.current.setValue('lastname', payload.lastname);
      result.current.setValue('email', payload.email);
      result.current.setValue('password', payload.password);
      result.current.setValue('confirmPassword', payload.confirmPassword);
    });
    await act(async () => {
      await result.current.submit();
    });
    // Assert
    expect(registerSvc).toHaveBeenCalledTimes(1);
    expect(registerSvc).toHaveBeenCalledWith({
      name: payload.name,
      lastname: payload.lastname,
      email: payload.email,
      password: payload.password,
    });
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  it('should return error if payload is invalid', async () => {
    // Arrange
    const payload: AuthRegisterPayload = {
      name: '',
      lastname: 'Villa',
      email: 'dv@gmail.com',
      password: 'password_123',
      confirmPassword: 'password_123',
    };
    // Act
    const { result } = renderHook(() => useRegisterPage());
    act(() => {
      result.current.setValue('name', payload.name);
      result.current.setValue('lastname', payload.lastname);
      result.current.setValue('email', payload.email);
      result.current.setValue('password', payload.password);
      result.current.setValue('confirmPassword', payload.confirmPassword);
    });
    await act(async () => {
      await result.current.submit();
    });
    // Assert
    expect(registerSvc).not.toHaveBeenCalled();
    expect(result.current.errors.name?.message).toEqual('Name must be at least 3 characters long');
  });
});

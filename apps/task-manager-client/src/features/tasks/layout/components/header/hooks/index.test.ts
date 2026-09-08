import { logoutSvc } from '@features/auth/services';
import { act, renderHook } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import useHeader from '.';
import type { UserMeResponse } from '@task-manager-system/api-types';

vi.mock('@features/auth/services', () => ({
  logoutSvc: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  MemoryRouter: vi.fn(),
}));

describe('Tasks: useHeader', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render with user', () => {
    // Arrange
    const user: UserMeResponse = {
      id: '123',
      name: 'Diego',
      lastname: 'Villa',
      email: 'dv@gmail.com',
    };
    localStorage.setItem('ME', JSON.stringify(user));
    // Act
    const { result } = renderHook(() => useHeader());
    // Assert
    expect(result.current.user).toEqual(user);
    expect(localStorage.getItem('ME')).toEqual(JSON.stringify(user));
  });

  it('should render with user null', () => {
    // Arrange
    // Act
    const { result } = renderHook(() => useHeader());
    // Assert
    expect(result.current.user).toBeNull();
  });

  it('should logout', () => {
    // Arrange
    const mockedNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockedNavigate);
    vi.mocked(logoutSvc).mockReturnValue();
    // Act
    const { result } = renderHook(() => useHeader());
    act(() => {
      result.current.logout();
    });
    // Assert
    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith('/auth/login');
    expect(localStorage.getItem('ME')).toBeNull();
  });
});

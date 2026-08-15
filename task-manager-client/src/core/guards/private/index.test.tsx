import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateGuard from '.';

describe('Private Guard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should redirect to login if token is not present', () => {
    // Arrange
    // Act
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<PrivateGuard />}>
            <Route index element={<h1>Home</h1>} />
          </Route>
          <Route path="/auth/login" element={<h1>Login</h1>} />
        </Routes>
      </MemoryRouter>,
    );
    // Assert
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('should show home if token is present', () => {
    // Arrange
    localStorage.setItem('TOKEN', 'token_123');
    // Act
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<PrivateGuard />}>
            <Route index element={<h1>Home</h1>} />
          </Route>
          <Route path="/auth/login" element={<h1>Login</h1>} />
        </Routes>
      </MemoryRouter>,
    );
    // Assert
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PublicGuard from ".";

describe('Public Guard', () => {

  beforeEach(() => {
    localStorage.clear();
  })

  it('should redirect to home if token is present', () => {
    // Arrange
    localStorage.setItem('TOKEN', 'token_123');
    // Act
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <Routes>
          <Route path="/auth" element={<PublicGuard />}>
            <Route path="login" element={<h1>Login</h1>} />
          </Route>
          <Route path="/" index element={<h1>Home</h1>} />
        </Routes>
      </MemoryRouter>
    );
    // Assert
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('should show login if token is not present', () => {
    // Arrange
    // Act
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <Routes>
          <Route path="/auth" element={<PublicGuard />}>
            <Route path="login" element={<h1>Login</h1>} />
          </Route>
          <Route path="/" index element={<h1>Home</h1>} />
        </Routes>
      </MemoryRouter>
    );
    // Assert
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });
});
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MainLayout from '.';

describe('Tasks: Layout', () => {
  const renderLayout = (initialPath = '/', outletContent = <div>Hijo Renderizado</div>) => {
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={initialPath} element={outletContent} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
  };

  it('should render component', () => {
    // Act
    renderLayout();
    // Assert
    expect(screen.getByText('Hijo Renderizado')).toBeInTheDocument();
  });
});

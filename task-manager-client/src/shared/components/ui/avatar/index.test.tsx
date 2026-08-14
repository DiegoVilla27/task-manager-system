import { render, screen } from '@testing-library/react';
import { Avatar } from ".";

describe('UI: avatar', () => {

  it('should render with src', () => {
    // Arrange
    const name: string = 'John Doe';
    const src: string = 'https://example.com/image.png';
    // Act
    render(<Avatar name={name} src={src} />);
    // Assert
    expect(screen.getByAltText(name)).toBeInTheDocument();
  });

  it('should render initials', () => {
    // Arrange
    const name: string = 'John Doe';
    // Act
    render(<Avatar name={name} />);
    // Assert
    expect(screen.getByText('JD')).toBeInTheDocument();
  });
});
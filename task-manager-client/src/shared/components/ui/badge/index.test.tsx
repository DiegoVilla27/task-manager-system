import { render, screen } from "@testing-library/react";
import { Badge } from ".";

describe('UI: badge', () => {

  it('should render a badge with text', () => {
    // Arrange
    const text: string = 'Badge Diego';
    // Act
    render(<Badge>{text}</Badge>);
    // Assert
    expect(screen.getByText('Badge Diego')).toBeInTheDocument();
  });
});
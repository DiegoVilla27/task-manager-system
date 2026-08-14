import { render, screen } from "@testing-library/react";
import { Link } from ".";
import { BrowserRouter } from "react-router-dom";

describe('UI: link', () => {

  it('should render link', () => {
    // Arrange
    const text: string = 'Google';
    // Act
    render(
      <Link to={'https://google.com'}>{text}</Link>,
      { wrapper: BrowserRouter }
    );
    // Assert
    expect(screen.getByText(text)).toBeInTheDocument();
  });
});

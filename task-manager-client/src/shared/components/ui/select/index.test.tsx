import { render, screen } from "@testing-library/react";
import { Select, type SelectOption } from ".";

describe('UI: select', () => {

  it('should render select', () => {
    // Arrange
    // Act
    render(
      <Select options={[]} />
    );
    // Assert
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render select with label', () => {
    // Arrange
    // Act
    render(
      <Select label="test" options={[]} />
    );
    // Assert
    expect(screen.getByLabelText('test')).toBeInTheDocument();
  });

  it('should render select with error', () => {
    // Arrange
    // Act
    render(
      <Select error="test error" options={[]} />
    );
    // Assert
    expect(screen.getByText('test error')).toBeInTheDocument();
  });

  it('should render select with options', () => {
    // Arrange
    const options: SelectOption[] = [
      {
        value: 'test',
        label: 'test',
      },
      {
        value: 'test2',
        label: 'test2',
      },
    ];
    // Act
    render(
      <Select options={options} />
    );
    // Assert
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Button } from '../button';

describe('Button', () => {
  it('should render button with default props', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('should render button with custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);

    const button = screen.getByRole('button', { name: 'Custom Button' });
    expect(button).toHaveClass('custom-class');
  });

  it('should handle click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole('button', { name: 'Disabled Button' });
    expect(button).toBeDisabled();
  });

  it('should render different variants correctly', () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');

    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border', 'border-input');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-secondary');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('hover:bg-accent');

    rerender(<Button variant="link">Link</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-primary', 'underline-offset-4');
  });

  it('should render different sizes correctly', () => {
    const { rerender } = render(<Button size="default">Default Size</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10', 'px-4', 'py-2');

    rerender(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-9', 'rounded-md', 'px-3');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11', 'rounded-md', 'px-8');

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10', 'w-10');
  });

  it('should render as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Link Button' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('should pass through additional props', () => {
    render(
      <Button
        data-testid="test-button"
        aria-label="Test button"
        type="submit"
      >
        Test Button
      </Button>
    );

    const button = screen.getByTestId('test-button');
    expect(button).toHaveAttribute('aria-label', 'Test button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should handle keyboard interactions', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Keyboard Button</Button>);

    const button = screen.getByRole('button', { name: 'Keyboard Button' });
    button.focus();

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('should not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button disabled onClick={handleClick}>Disabled Button</Button>);

    const button = screen.getByRole('button', { name: 'Disabled Button' });
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should have proper accessibility attributes', () => {
    render(<Button aria-describedby="description">Accessible Button</Button>);

    const button = screen.getByRole('button', { name: 'Accessible Button' });
    expect(button).toHaveAttribute('aria-describedby', 'description');
  });
}); 
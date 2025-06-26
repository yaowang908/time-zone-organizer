import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DatePicker } from '../date-picker';

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

describe('DatePicker', () => {
  const mockOnChange = jest.fn();
  const defaultDate = new Date('2024-01-15T10:30:00');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the date picker with correct initial value', () => {
    render(<DatePicker value={defaultDate} onChange={mockOnChange} />);
    expect(screen.getByText('Local Time')).toBeInTheDocument();
    expect(screen.getByText('1/15/2024 10:30 AM')).toBeInTheDocument();
  });

  it('opens calendar popup when clicked', () => {
    render(<DatePicker value={defaultDate} onChange={mockOnChange} />);
    const dateDisplay = screen.getByText('1/15/2024 10:30 AM');
    fireEvent.click(dateDisplay);
    expect(screen.getByText('January 2024')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
  });

  it('displays correct month and year in header', () => {
    render(<DatePicker value={defaultDate} onChange={mockOnChange} />);
    const dateDisplay = screen.getByText('1/15/2024 10:30 AM');
    fireEvent.click(dateDisplay);
    expect(screen.getByText('January 2024')).toBeInTheDocument();
  });

  it('allows navigation to previous month', () => {
    render(<DatePicker value={defaultDate} onChange={mockOnChange} />);
    const dateDisplay = screen.getByText('1/15/2024 10:30 AM');
    fireEvent.click(dateDisplay);
    const prevButton = screen.getByRole('button', { name: /previous month/i });
    fireEvent.click(prevButton);
    expect(screen.getByText('December 2023')).toBeInTheDocument();
  });

  it('allows navigation to next month', () => {
    render(<DatePicker value={defaultDate} onChange={mockOnChange} />);
    const dateDisplay = screen.getByText('1/15/2024 10:30 AM');
    fireEvent.click(dateDisplay);
    const nextButton = screen.getByRole('button', { name: /next month/i });
    fireEvent.click(nextButton);
    expect(screen.getByText('February 2024')).toBeInTheDocument();
  });

  it('selects a date when day is clicked', () => {
    render(<DatePicker value={defaultDate} onChange={mockOnChange} />);
    const dateDisplay = screen.getByText('1/15/2024 10:30 AM');
    fireEvent.click(dateDisplay);
    const dayButton = screen.getByText('20');
    fireEvent.click(dayButton);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Date));
    const newDate = mockOnChange.mock.calls[0][0];
    expect(newDate.getDate()).toBe(20);
    expect(newDate.getMonth()).toBe(0); // January
    expect(newDate.getFullYear()).toBe(2024);
  });

  it("highlights today's date when it's not selected", () => {
    const today = new Date();
    const todayDate = today.getDate();
    // Use a different selected date to ensure today is not selected
    const selectedDate = new Date(today);
    selectedDate.setDate(todayDate === 1 ? 2 : 1);
    render(<DatePicker value={selectedDate} onChange={mockOnChange} />);
    const dateDisplay = screen.getByText(`${selectedDate.toLocaleDateString()} ${selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    fireEvent.click(dateDisplay);
    const todayButton = screen.getByText(todayDate.toString());
    expect(todayButton).toHaveClass('bg-blue-500/30');
  });

  it('highlights selected date', () => {
    render(<DatePicker value={defaultDate} onChange={mockOnChange} />);
    const dateDisplay = screen.getByText('1/15/2024 10:30 AM');
    fireEvent.click(dateDisplay);
    const selectedButton = screen.getByText('15');
    expect(selectedButton).toHaveClass('bg-blue-600');
  });

  it('allows time selection', () => {
    render(<DatePicker value={defaultDate} onChange={mockOnChange} />);
    const dateDisplay = screen.getByText('1/15/2024 10:30 AM');
    fireEvent.click(dateDisplay);
    const timeDisplay = screen.getByText('10:30');
    expect(timeDisplay).toBeInTheDocument();
  });

  it('closes popup when date is selected', async () => {
    render(<DatePicker value={defaultDate} onChange={mockOnChange} />);
    const dateDisplay = screen.getByText('1/15/2024 10:30 AM');
    fireEvent.click(dateDisplay);
    expect(screen.getByText('January 2024')).toBeInTheDocument();
    const dayButton = screen.getByText('20');
    fireEvent.click(dayButton);
    await waitFor(() => {
      expect(screen.queryByText('January 2024')).not.toBeInTheDocument();
    });
  });

  it('toggles popup when input is clicked again', () => {
    render(<DatePicker value={defaultDate} onChange={mockOnChange} />);
    const dateDisplay = screen.getByText('1/15/2024 10:30 AM');
    // First click opens
    fireEvent.click(dateDisplay);
    expect(screen.getByText('January 2024')).toBeInTheDocument();
    // Second click closes
    fireEvent.click(dateDisplay);
    expect(screen.queryByText('January 2024')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<DatePicker value={defaultDate} onChange={mockOnChange} className="custom-class" />);
    // The outermost container has the class
    const container = screen.getByText('Local Time').closest('div.relative');
    expect(container).toHaveClass('custom-class');
  });

  it('prioritizes selected date over today highlight', () => {
    const today = new Date();
    render(<DatePicker value={today} onChange={mockOnChange} />);
    const dateDisplay = screen.getByText(`${today.toLocaleDateString()} ${today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    fireEvent.click(dateDisplay);
    const todayButton = screen.getByText(today.getDate().toString());
    // When today is selected, it should have the selected class, not the today class
    expect(todayButton).toHaveClass('bg-blue-600');
    expect(todayButton).not.toHaveClass('bg-blue-500/30');
  });
}); 
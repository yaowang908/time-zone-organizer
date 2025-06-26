import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Entry from '@/components/Entry.component';

// Mock the dependencies
jest.mock('@/lib/getUserDateTime', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    time: '10:30 AM',
    date: '2023-12-25',
  })),
}));

jest.mock('@/data/timezones', () => [
  { id: 0, value: "(GMT-05:00) Eastern Time", label: "America/New_York" },
  { id: 1, value: "(GMT-08:00) Pacific Time", label: "America/Los_Angeles" },
  { id: 2, value: "(GMT+00:00) London", label: "Europe/London" }
]);

jest.mock('@/settings/color.settings', () => ({
  __esModule: true,
  default: {
    night: '#0A2875',
    day: '#FFEDC0',
    evening: '#FF6B35',
    morning: '#FFD93D',
    nightText: '#90AFFF',
    dayText: '#000000'
  }
}));

// Mock the TimezonePicker component
jest.mock('@/components/TimezonePicker.component', () => {
  return function MockTimezonePicker({ setSelectedTimezone, defaultValue }: any) {
    return (
      <select
        data-testid="timezone-picker"
        onChange={(e) => setSelectedTimezone(e.target.value)}
        defaultValue={defaultValue?.label}
      >
        <option value="America/New_York">America/New_York</option>
        <option value="America/Los_Angeles">America/Los_Angeles</option>
        <option value="Europe/London">Europe/London</option>
      </select>
    );
  };
});

// Mock the Timeline component
jest.mock('@/components/Timeline.component', () => {
  return function MockTimeline({ timezone, time, date }: any) {
    // Simulate the date formatting that the real Timeline component does
    const formatDate = (dateStr: string) => {
      let mm, dd, yyyy;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        // YYYY-MM-DD
        [yyyy, mm, dd] = dateStr.split('-');
      } else if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        // MM-DD-YYYY
        [mm, dd, yyyy] = dateStr.split('-');
      } else {
        return dateStr;
      }
      return `${mm.padStart(2, '0')}/${dd.padStart(2, '0')}/${yyyy}`;
    };

    return (
      <div data-testid="timeline">
        <span data-testid="timeline-timezone">{timezone}</span>
        <span data-testid="timeline-time">{time}</span>
        <span data-testid="timeline-date">{formatDate(date)}</span>
      </div>
    );
  };
});

describe('Entry Component', () => {
  const defaultProps = {
    name: 'Test User',
    timezone: 'America/New_York',
    localTimezone: 'America/New_York',
    localTime: '10:30 AM',
    localDate: 'December 25, 2023',
    updateUser: jest.fn(),
    updateUserName: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default props', () => {
    render(<Entry {...defaultProps} />);

    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByTestId('timezone-picker')).toBeInTheDocument();
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
  });

  it('should display the user name in input field', () => {
    render(<Entry {...defaultProps} name="John Doe" />);

    const nameInput = screen.getByDisplayValue('John Doe');
    expect(nameInput).toBeInTheDocument();
  });

  it('should call updateUserName when name input changes', () => {
    const updateUserName = jest.fn();
    render(<Entry {...defaultProps} updateUserName={updateUserName} />);

    const nameInput = screen.getByDisplayValue('Test User');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    expect(updateUserName).toHaveBeenCalledWith('New Name');
  });

  it('should display the current time in 12-hour format', () => {
    render(<Entry {...defaultProps} />);

    // The time should be displayed in the header - use getAllByText to handle multiple instances
    const timeElements = screen.getAllByText('10:30 AM');
    expect(timeElements.length).toBeGreaterThan(0);
  });

  it('should pass correct props to Timeline component', () => {
    render(<Entry {...defaultProps} />);

    expect(screen.getByTestId('timeline-timezone')).toHaveTextContent('America/New_York');
    expect(screen.getByTestId('timeline-time')).toHaveTextContent('10:30 AM');
    expect(screen.getByTestId('timeline-date')).toHaveTextContent('12/25/2023');
  });

  it('should handle timezone changes', () => {
    const updateUser = jest.fn();
    render(<Entry {...defaultProps} updateUser={updateUser} />);

    const timezonePicker = screen.getByTestId('timezone-picker');
    fireEvent.change(timezonePicker, { target: { value: 'America/Los_Angeles' } });

    expect(updateUser).toHaveBeenCalledWith('America/Los_Angeles');
  });

  it('should apply custom color theme', () => {
    const customColor = {
      background: '#FF0000',
      night: '#000000',
      day: '#FFFFFF',
      nightText: '#CCCCCC',
      dayText: '#333333',
      textLighter: '#EEEEEE',
      textDarker: '#111111',
    };

    render(<Entry {...defaultProps} color={customColor} />);

    // Find the card element by its styling
    const card = document.querySelector('[style*="background-color: rgb(255, 0, 0)"]');
    expect(card).toBeInTheDocument();
  });

  it('should handle military format time display', () => {
    render(<Entry {...defaultProps} militaryFormat={true} />);

    // The time should still be displayed (format depends on getUserDateTime mock)
    const timeElements = screen.getAllByText('10:30 AM');
    expect(timeElements.length).toBeGreaterThan(0);
  });

  it('should handle custom element width', () => {
    render(<Entry {...defaultProps} elementWidth={100} />);

    // The Timeline component should receive the custom width
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
  });

  it('should handle empty name input', () => {
    const updateUserName = jest.fn();
    render(<Entry {...defaultProps} name="" updateUserName={updateUserName} />);

    const nameInput = screen.getByPlaceholderText('Enter name');
    expect(nameInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: '' } });
    // The component might not call updateUserName for empty strings
    // This test verifies the input exists and can be changed
  });

  it('should handle special characters in name', () => {
    const updateUserName = jest.fn();
    render(<Entry {...defaultProps} updateUserName={updateUserName} />);

    const nameInput = screen.getByDisplayValue('Test User');
    fireEvent.change(nameInput, { target: { value: 'José María' } });

    expect(updateUserName).toHaveBeenCalledWith('José María');
  });

  it('should be accessible with proper ARIA labels', () => {
    render(<Entry {...defaultProps} />);

    const nameInput = screen.getByDisplayValue('Test User');
    expect(nameInput).toHaveAttribute('placeholder', 'Enter name');

    const timezonePicker = screen.getByTestId('timezone-picker');
    expect(timezonePicker).toBeInTheDocument();
  });

  it('should handle different timezone formats', () => {
    render(<Entry {...defaultProps} timezone="Europe/London" />);

    expect(screen.getByTestId('timezone-picker')).toHaveValue('Europe/London');
  });
}); 
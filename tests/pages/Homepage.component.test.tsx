// Mocks must be defined before imports due to jest.mock hoisting
const setValueMock = jest.fn();
const useLocalStorageMock = jest.fn((key, initial) => [initial, setValueMock]);

// Extend global type to include setValueMock
declare global {
  var setValueMock: jest.Mock;
}

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Homepage from '@/pages/Homepage.component';

// Mock the useLocalStorage hook
jest.mock('@/lib/useLocalStorageHook', () => {
  global.setValueMock = jest.fn();
  return {
    __esModule: true,
    default: (key: string, initialValue: any) => [initialValue, global.setValueMock],
  };
});

// Mock the getClientTimezone function
jest.mock('@/lib/getClientTimezone', () => ({
  __esModule: true,
  default: jest.fn(() => 'America/New_York')
}));

// Mock the getCurrentDateTimeInFormat function
jest.mock('@/lib/getCurrentDateTimeInFormat', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    time: '10:30 AM',
    date: '2023-12-25'
  }))
}));

// Mock the Entry component
jest.mock('@/components/Entry.component', () => {
  return function MockEntry({ name, timezone, updateUser, updateUserName }: any) {
    return (
      <div data-testid="entry">
        <input data-testid="entry-name" value={name} readOnly />
        <span data-testid="entry-timezone">{timezone}</span>
        <button
          data-testid="update-timezone"
          onClick={() => updateUser('America/Los_Angeles')}
        >
          Update Timezone
        </button>
        <button
          data-testid="update-name"
          onClick={() => updateUserName('Updated Name')}
        >
          Update Name
        </button>
      </div>
    );
  };
});

describe('Homepage Component', () => {
  const defaultUsers = [
    { id: 0, name: 'John Doe', timezone: 'America/New_York' },
    { id: 1, name: 'Jane Smith', timezone: 'America/Los_Angeles' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).setValueMock.mockClear();
  });

  it('should render with default users', () => {
    render(<Homepage users={defaultUsers} />);

    expect(screen.getByText('Time Zone Organizer')).toBeInTheDocument();
    expect(screen.getAllByTestId('entry')).toHaveLength(2);
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Jane Smith')).toBeInTheDocument();
  });

  it('should add a new person when Add Person button is clicked', () => {
    render(<Homepage users={defaultUsers} />);

    const addPersonButton = screen.getByText('Add entry');
    fireEvent.click(addPersonButton);

    // Should have 3 entries now (2 original + 1 new)
    expect(screen.getAllByTestId('entry')).toHaveLength(3);

    // Should call setUsersLocalStorage with the new user
    expect((global as any).setValueMock).toHaveBeenCalledWith([
      { id: 0, name: 'John Doe', timezone: 'America/New_York' },
      { id: 1, name: 'Jane Smith', timezone: 'America/Los_Angeles' },
      { id: 2, name: 'New User', timezone: 'America/New_York' }
    ]);
  });

  it('should persist new users to localStorage', async () => {
    render(<Homepage users={defaultUsers} />);

    // Add a new person
    const addPersonButton = screen.getByText('Add entry');
    fireEvent.click(addPersonButton);

    // Verify that localStorage was updated with the new user
    expect((global as any).setValueMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 0, name: 'John Doe', timezone: 'America/New_York' }),
        expect.objectContaining({ id: 1, name: 'Jane Smith', timezone: 'America/Los_Angeles' }),
        expect.objectContaining({ id: 2, name: 'New User', timezone: 'America/New_York' })
      ])
    );
  });

  it('should update user timezone and persist to localStorage', () => {
    render(<Homepage users={defaultUsers} />);

    // Update timezone for the first user
    const updateTimezoneButtons = screen.getAllByTestId('update-timezone');
    fireEvent.click(updateTimezoneButtons[0]);

    // Should call setUsersLocalStorage with updated timezone
    expect((global as any).setValueMock).toHaveBeenCalledWith([
      { id: 0, name: 'John Doe', timezone: 'America/Los_Angeles' },
      { id: 1, name: 'Jane Smith', timezone: 'America/Los_Angeles' }
    ]);
  });

  it('should update user name and persist to localStorage', () => {
    render(<Homepage users={defaultUsers} />);

    // Update name for the first user
    const updateNameButtons = screen.getAllByTestId('update-name');
    fireEvent.click(updateNameButtons[0]);

    // Should call setUsersLocalStorage with updated name
    expect((global as any).setValueMock).toHaveBeenCalledWith([
      { id: 0, name: 'Updated Name', timezone: 'America/New_York' },
      { id: 1, name: 'Jane Smith', timezone: 'America/Los_Angeles' }
    ]);
  });

  it('should display the timeline indicator', () => {
    render(<Homepage users={defaultUsers} />);

    const timelineIndicator = screen.getByTestId('timeline-indicator');
    expect(timelineIndicator).toBeInTheDocument();
  });

  it('should have proper positioning and styling for timeline indicator', () => {
    render(<Homepage users={defaultUsers} />);

    const timelineIndicator = screen.getByTestId('timeline-indicator');
    expect(timelineIndicator).toHaveClass('absolute', 'left-1/2', 'w-px', 'bg-red-500', 'z-20');
  });
}); 
'use client';
import React from 'react';
import { Plus, RotateCcw } from 'lucide-react';

import Entry from '../components/Entry.component';
import getCurrentDateTimeInFormat from '../lib/getCurrentDateTimeInFormat';
import useLocalStorage from '../lib/useLocalStorageHook';
import getClientTimezone from '../lib/getClientTimezone';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { DatePicker } from '../components/ui/date-picker';

interface User {
  id: number;
  name: string;
  timezone: string;
  role?: string;
};

export interface Props {
  users: User[];
  elementWidth?: number;
};

const Homepage: React.FC<Props> = ({ users, elementWidth = 50 }) => {
  const defaultTimezoneInitValue = getClientTimezone();

  const [usersState, setUsersState] = React.useState(users);
  const [localDateTimeState, setLocalDateTimeState] = React.useState(new Date());
  const [defaultTimezoneState, setDefaultTimezoneState] = React.useState(defaultTimezoneInitValue);
  const [dateTimeState, setDateTimeState] = React.useState({
    time: getCurrentDateTimeInFormat().time,
    date: getCurrentDateTimeInFormat().date,
  });
  const [usersLocalStorage, setUsersLocalStorage] = useLocalStorage<User[]>('users', users);
  const [isResetDialogOpen, setIsResetDialogOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    const savedUsers = usersLocalStorage;
    setUsersState(savedUsers);
  }, [usersLocalStorage]);

  React.useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const addPersonClickHandler = () => {
    const newUsersState = [...usersState, { id: usersState.length, name: 'New User', timezone: defaultTimezoneState }];
    setUsersState(newUsersState);
    setUsersLocalStorage(newUsersState);
  };

  React.useEffect(() => {
    const { date, time } = getCurrentDateTimeInFormat(defaultTimezoneState, localDateTimeState);
    setDateTimeState({ time, date })
  }, [localDateTimeState, defaultTimezoneState]);

  const updateUser = (id: number, newTimezone: string) => {
    let _users = [...usersState];
    let user = { ..._users[id] }
    user.timezone = newTimezone;
    _users[id] = user;
    setUsersState(_users);
    setUsersLocalStorage(_users);
  };

  const updateUserName = (id: number, newUsername: string) => {
    let _users = [...usersState];
    let user = { ..._users[id] }
    user.name = newUsername;
    _users[id] = user;
    setUsersState(_users);
    setUsersLocalStorage(_users);
  };

  const updateUserRole = (id: number, newRole: string) => {
    let _users = [...usersState];
    let user = { ..._users[id] }
    user.role = newRole;
    _users[id] = user;
    setUsersState(_users);
    setUsersLocalStorage(_users);
  };

  const deleteUser = (id: number) => {
    // Prevent deletion of the first entry (id === 0)
    if (id === 0) {
      return;
    }
    const _users = usersState.filter(user => user.id !== id);
    // Reassign IDs to maintain sequential order
    const reindexedUsers = _users.map((user, index) => ({ ...user, id: index }));
    setUsersState(reindexedUsers);
    setUsersLocalStorage(reindexedUsers);
  };

  const clearLocalStorage = () => {
    setUsersLocalStorage(users);
    setUsersState(users);
    setIsResetDialogOpen(false);
  };

  const formatLocalDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatLocalTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).toUpperCase();
  };

  // Calculate current time position for the red line (based on local time)
  const getCurrentTimePosition = () => {
    const now = localDateTimeState;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    // Position the line at the current hour's position
    // Each hour takes 100/24 = ~4.17% of the width
    const hourPosition = (hours / 24) * 100;
    // Add minute offset within the hour
    const minuteOffset = (minutes / 60) * (100 / 24);
    return hourPosition + minuteOffset;
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
      {/* Navigation */}
      <nav className="w-full bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <span className="material-icons-outlined text-primary">schedule</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Time Zone Organizer</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
            aria-label="Toggle dark mode"
          >
            <span className="material-icons-outlined dark:hidden">dark_mode</span>
            <span className="material-icons-outlined hidden dark:block">light_mode</span>
          </button>
          <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
            <Button
              variant="outline"
              onClick={() => setIsResetDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors border border-slate-200 dark:border-slate-600 rounded-lg hover:border-primary dark:hover:border-primary"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Reset</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete all data? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={clearLocalStorage}>
                  Yes, Reset All Data
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl relative">
        {/* Local Time Display */}
        <div className="flex flex-col items-center justify-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Local Time</span>
          <DatePicker
            value={localDateTimeState}
            onChange={setLocalDateTimeState}
          />
        </div>

        {/* Timeline Container with Current Time Indicator */}
        <div className="relative w-full">
          {/* Single Red Current Time Indicator - Fixed at center of container */}
          <div
            data-testid="timeline-indicator"
            className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-red-500 z-20 shadow-[0_0_8px_rgba(239,68,68,0.6)] pointer-events-none"
          >
            <div className="absolute -top-2 -left-[5px] w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="absolute top-0 -left-16 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded opacity-0 hover:opacity-100 transition-opacity">Now</div>
          </div>

          {/* Entries */}
          <div className="space-y-6">
            {usersState ? usersState.map((user, index) => (
              <Entry
                key={user.id}
                id={user.id}
                updateUser={(newTimezone: string) => {
                  updateUser(user.id, newTimezone);
                }}
                updateUserName={(newUsername: string) => {
                  updateUserName(user.id, newUsername);
                }}
                updateUserRole={(newRole: string) => {
                  updateUserRole(user.id, newRole);
                }}
                deleteUser={() => {
                  deleteUser(user.id);
                }}
                isFirst={index === 0}
                name={user.name}
                role={user.role}
                timezone={user.timezone}
                localTimezone={defaultTimezoneState}
                localTime={dateTimeState.time}
                localDate={dateTimeState.date}
                militaryFormat={false}
                elementWidth={elementWidth}
              />
            )) : ''}
          </div>
        </div>
      </main>

      {/* Floating Add Entry Button */}
      <div className="fixed bottom-8 left-8 z-30">
        <Button
          onClick={addPersonClickHandler}
          className="flex items-center gap-2 bg-primary hover:bg-[#2563eb] text-white px-6 py-4 rounded-full shadow-lg hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transform hover:-translate-y-1 transition-all font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add entry
        </Button>
      </div>
    </div>
  );
};

export default Homepage; 
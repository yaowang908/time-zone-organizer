'use client';
import React from 'react';
import { Calendar, Clock, Plus, RotateCcw } from 'lucide-react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import defaultColor from '../settings/color.settings';
import Entry from '../components/Entry.component';
import getCurrentDateTimeInFormat from '../lib/getCurrentDateTimeInFormat';
import useLocalStorage from '../lib/useLocalStorageHook';
import getClientTimezone from '../lib/getClientTimezone';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';

interface User {
  id: number;
  name: string;
  timezone: string;
};

export interface Props {
  users: User[];
  color?: {
    night?: string;
    day?: string;
    nightText?: string;
    dayText?: string;
    background?: string;
    textLighter?: string;
    textDarker?: string;
    white?: string;
  };
  elementWidth?: number;
};

const Homepage: React.FC<Props> = ({ users, color = defaultColor, elementWidth = 50 }) => {

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

  React.useEffect(() => {
    const savedUsers = usersLocalStorage;
    setUsersState(savedUsers);
  }, [usersLocalStorage]);

  const addPersonClickHandler = () => {
    const newUsersState = [...usersState, { id: usersState.length, name: 'New User', timezone: defaultTimezoneState }];
    setUsersState(newUsersState);
    setUsersLocalStorage(newUsersState);
  };

  React.useEffect(() => {
    const { date, time } = getCurrentDateTimeInFormat(defaultTimezoneState, localDateTimeState);
    setDateTimeState({ time, date })
  }, [localDateTimeState]);

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

  const clearLocalStorage = () => {
    setUsersLocalStorage(users);
    setUsersState(users);
    setIsResetDialogOpen(false);
  };

  const reset = () => {
    setIsResetDialogOpen(true);
  };

  return (
    <div className='min-h-screen' style={{ backgroundColor: color.background }}>
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 border-b border-white/20">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-900" />
          </div>
          <h1 className="text-2xl font-bold text-white">Time Zone Organizer</h1>
        </div>
        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogTrigger asChild>
            <Button className="text-white border border-white/20 hover:bg-white/10 bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </DialogTrigger>
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
      </nav>

      {/* Local Time Section */}
      <div className="relative flex justify-center py-8">
        <Card className="w-96 bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-white/80">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Local Time</span>
              </div>
              <Input
                type="datetime-local"
                value={localDateTimeState.toISOString().slice(0, 16)}
                onChange={(e) => setLocalDateTimeState(new Date(e.target.value))}
                className="text-center text-xl font-semibold bg-transparent border-0 text-white focus:ring-0"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Indicator */}
      <div className="relative">
        <div className="absolute left-1/2 w-px h-full bg-red-500 z-10"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 pb-20">
        {usersState ? usersState.map((user, index) => (
          <Entry
            key={index}
            updateUser={(newTimezone: string) => {
              updateUser(user.id, newTimezone);
            }}
            updateUserName={(newUsername: string) => {
              updateUserName(user.id, newUsername);
            }}
            name={user.name}
            timezone={user.timezone}
            localTimezone={defaultTimezoneState}
            localTime={dateTimeState.time}
            localDate={dateTimeState.date}
            militaryFormat={false}
            elementWidth={elementWidth}
          />
        )) : ''}
      </div>

      {/* Footer */}
      <div className="fixed bottom-6 left-6">
        <Button
          onClick={addPersonClickHandler}
          className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-400"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Person
        </Button>
      </div>
    </div>
  );
};

export default Homepage; 
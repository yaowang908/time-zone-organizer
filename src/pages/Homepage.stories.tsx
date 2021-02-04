import React from 'react';
import { Story, Meta } from '@storybook/react';
import Homepage, { Props } from './Homepage.component';

export default {
  component: Homepage,
  title: 'Homepage',
} as Meta;

const Template: Story<Props> = (args:Props) => <Homepage {...args} />;

export const Default: Story<Props> = Template.bind({});
Default.args = {
  time: '20:08',
  date: '2-2-2021',
  users: [
    {
      name: 'Andrew Lee',
      time: '20:08',
      date: '2-2-2021',
      timezone: 'America/New_York',
    },
    {
      name: 'Tyrik Celia',
      time: '23:30',
      date: '2-3-2021',
      timezone: 'Asia/Jerusalem',
    },
    {
      name: 'Henricus Peter',
      time: '0:00',
      date: '2-2-2021',
      timezone: 'Australia/Adelaide',
    },
  ],
  elementWidth: 70,
} as Partial<Props>;
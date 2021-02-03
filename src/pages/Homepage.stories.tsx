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
      time: '16:00',
      date: '2-3-2021',
      timezone: 'Asia/Jerusalem',
    },
    {
      name: 'Henricus Peter',
      time: '1:25',
      date: '2-2-2021',
      timezone: 'Australia/Adelaide',
    },
  ]
} as Partial<Props>;
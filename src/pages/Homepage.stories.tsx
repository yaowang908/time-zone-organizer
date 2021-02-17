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
  users: [
    {
      id: 0,
      name: 'Andrew Lee',
      timezone: 'America/New_York',
    },
    {
      id: 1,
      name: 'Tyrik Celia',
      timezone: 'Asia/Jerusalem',
    },
    {
      id: 2,
      name: 'Henricus Peter',
      timezone: 'Australia/Adelaide',
    },
  ],
  elementWidth: 70,
} as Partial<Props>;
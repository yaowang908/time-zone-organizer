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
      name: 'Andrew Lee',
      timezone: 'America/New_York',
    },
    {
      name: 'Tyrik Celia',
      timezone: 'Asia/Jerusalem',
    },
    {
      name: 'Henricus Peter',
      timezone: 'Australia/Adelaide',
    },
  ],
  elementWidth: 70,
} as Partial<Props>;
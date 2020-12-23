import React from 'react';
import { Story, Meta } from '@storybook/react'
import Timeline, { Props } from './Timeline.component';

export default {
  component: Timeline,
  title: 'Timeline',
} as Meta;

const Template: Story<Props> = (args:Props) => <Timeline {...args} />;

export const Default: Story<Props> = Template.bind({});
Default.args = {
  timezone: 'america/New_York',
  time: '11:43',
  date: '12-23-2020',
} as Partial<Props>;

export const NormalHours: Story<Props> = Template.bind({});
NormalHours.args = {
  timezone: 'america/New_York',
  time: '11:43',
  date: '12-23-2020',
  militaryFormat: false,
}
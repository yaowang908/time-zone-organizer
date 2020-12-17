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
} as Partial<Props>;
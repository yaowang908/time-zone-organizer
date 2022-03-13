import React from 'react';
import { Story, Meta } from '@storybook/react';
import Timeline, { Props } from './Timeline.component';

export default {
  component: Timeline,
  title: 'Timeline',
} as Meta;

const Template: Story<Props> = (args: Props) => <Timeline {...args} />;

export const Default: Story<Props> = Template.bind({});
Default.args = {
  timezone: 'america/New_York',
  time: '11:43',
  date: '12-23-2020',
} as Partial<Props>;

export const NormalHours: Story<Props> = Template.bind({});
NormalHours.args = {
  timezone: 'america/New_York',
  time: '9:43',
  date: '12-23-2020',
  militaryFormat: false,
} as Partial<Props>;

export const WithIndicator: Story<Props> = Template.bind({});
WithIndicator.args = {
  timezone: 'america/New_York',
  time: '23:20',
  date: '12-23-2020',
  militaryFormat: false,
  elementWidth: 50,
} as Partial<Props>;
WithIndicator.decorators = [
  (Story) => (
    <div
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        paddingTop: '100px',
      }}
    >
      <div
        style={{
          width: '0px',
          height: '100vh',
          position: 'absolute',
          top: '0',
          left: '50%',
          marginLeft: '0px',
          backgroundColor: 'transparent',
          border: '1px solid red',
          zIndex: 100,
        }}
      ></div>
      <Story />
    </div>
  ),
];

import React from 'react';
import { Story, Meta } from '@storybook/react';
import Entry, { Props } from './Entry.component';

export default {
  component: Entry,
  title: 'Entry',
} as Meta;

const Template: Story<Props> = (args: Props) => <Entry {...args} />;

export const Default: Story<Props> = Template.bind({});
Default.args = {
  timezone: 'america/New_York',
  localTime: '11:43',
  localDate: 'February 13, 2021',
} as Partial<Props>;

export const WithIndicator: Story<Props> = Template.bind({});
WithIndicator.args = {
  timezone: 'america/New_York',
  localTime: '11:20',
  localDate: 'February 13, 2021',
  militaryFormat: false,
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

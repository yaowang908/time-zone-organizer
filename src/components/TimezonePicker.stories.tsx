import React from 'react';
import { Story, Meta } from '@storybook/react';
import TimezonePicker, { Props } from './TimezonePicker.component';

export default {
  component: TimezonePicker,
  title: 'TimezonePicker',
} as Meta;

const Template: Story<Props> = (args:Props) => <TimezonePicker {...args} />;

export const Default: Story<Props> = Template.bind({});
Default.args = {

} as Partial<Props>; 
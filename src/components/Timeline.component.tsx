import React from 'react';

export interface Props {
  timezone: string;
}

const Timeline: React.FC<Props> = (props) => {
  const { timezone } = props;

  return (
    <div>
      This is a timeline component.<br/>
      {timezone ? timezone : ''}
    </div>
  )
}

export default Timeline;
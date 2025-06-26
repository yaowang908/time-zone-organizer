const getCurrentDateTimeInFormat = (
  timezone: string = 'America/New_York',
  timeDate: Date = new Date(0)
) => {
  const anchorDate = new Date(0);
  const localDateTime =
    timeDate.getTime() - anchorDate.getTime() !== 0
      ? new Date(timeDate).toLocaleString('en-US', {
        timeZone: 'America/New_York',
      })
      : new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  const _date = new Date(localDateTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const _time = new Date(localDateTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return {
    date: _date,
    time: _time,
  };
};

export default getCurrentDateTimeInFormat;

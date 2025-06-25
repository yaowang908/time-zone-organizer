const getClientTimezone = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone) return timezone;
  return 'America/New York';
};

export default getClientTimezone;
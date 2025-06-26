const getClientTimezone = () => {
  try {
    const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();
    const timezone = resolvedOptions?.timeZone;
    if (timezone) return timezone;
  } catch (error) {
    // Handle any errors that might occur
  }
  return 'America/New York';
};

export default getClientTimezone;
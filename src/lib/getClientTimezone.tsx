
const getClientTimezone = () => {
  // https://stackoverflow.com/a/44935836/4297819
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // console.log("🚀 ~ file: getClientTimezone.tsx ~ line 5 ~ getClientTimezone ~ timezone", timezone)
  // For browser that support Intl Api will return in format like: America/New York
  // ...for those that don't support Intl Api, will return undefined.
  if (timezone) return timezone;
  return 'America/New York';
};

export default getClientTimezone;
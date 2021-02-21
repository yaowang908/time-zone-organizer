const getCurrentDateTimeInFormat = (timezone:string = 'America/New_York', timeDate:Date = new Date(0)) => {
    const anchorDate = new Date(0);
    const localDateTime = 
      (timeDate.getTime() - anchorDate.getTime()) !== 0 ?
      (new Date(timeDate)).toLocaleString('en-US', { timeZone: 'America/New_York' } )
      :(new Date()).toLocaleString('en-US', { timeZone: 'America/New_York' } );
    //DONE: d.toLocaleString('en-US', { timeZone: 'America/New_York' })

    const _date = new Date(localDateTime).toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric' });
    const _time = new Date(localDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    // console.dir(_date);
    // console.dir(_time);
    return {
      date: _date, //February 13, 2021
      time: _time, //04:22 PM
    }
  };

export default getCurrentDateTimeInFormat;
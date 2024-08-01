const moment = require('moment');
require('moment-timezone');

function formatLastActive(lastActive) {
  const now = moment();
  const lastActiveMoment = moment(lastActive);

  const diff = now.diff(lastActiveMoment); // Difference in milliseconds

  const duration = moment.duration(diff);

  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  if (minutes === 0 && seconds < 60) {
    return 'Online';
  } else if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

module.exports = { formatLastActive };

export const getDate = (timestamp) => {
  const date = new Date(timestamp);
  const diff = Date.now() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds} sec ago`;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(diff / 86400000);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};
const monthsShort = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const getFullDay = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getDate()} ${monthsShort[date.getMonth()]} ${date.getFullYear()}`;
};


export function timeAgo(dateString: string): string {
  const now = new Date();
  const createdAt = new Date(dateString);
  //@ts-ignore
  const seconds = Math.floor((now - createdAt) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (let [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return count === 1 ? `1 ${unit} ago` : `${count} ${unit}s ago`;
    }
  }
  return "Just now";
}

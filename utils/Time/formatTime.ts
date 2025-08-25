export const formatDate = (ts: string) =>
  new Date(ts).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });

export const formatTime = (ts: string) =>
  new Date(ts)
    .toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
    .replace(':', '.');

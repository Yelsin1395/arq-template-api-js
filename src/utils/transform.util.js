export function limaTimestamp() {
  const date = new Date(new Date().getTime() - 5 * 60 * 60 * 1000);
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

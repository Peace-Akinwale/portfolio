// Month and day labels for the record. Pure, so client components can import it.
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function monthLabel(month: string): string {
  const [y, m] = month.split('-');
  return `${MONTHS[Number(m) - 1]} ${y}`;
}
export function monthShort(month: string): string {
  const [y, m] = month.split('-');
  return `${MONTHS[Number(m) - 1].slice(0, 3)} ${y}`;
}
export function dayLabel(date: string): string {
  const [y, m, d] = date.split('-');
  return `${Number(d)} ${MONTHS[Number(m) - 1].slice(0, 3)} ${y}`;
}

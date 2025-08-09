export function computeNextPeriodEnd(
  interval: 'month' | 'year',
  from: Date,
): Date {
  const end = new Date(from);
  if (interval === 'month') {
    end.setMonth(end.getMonth() + 1);
  } else {
    end.setFullYear(end.getFullYear() + 1);
  }
  return end;
}

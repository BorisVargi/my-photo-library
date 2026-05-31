import type { Trip } from '../../shared/api';

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTripDateRange(trip: Pick<Trip, 'date' | 'startDate' | 'endDate'>): string {
  if (trip.startDate && trip.endDate) {
    return `${formatDate(trip.startDate)} — ${formatDate(trip.endDate)}`;
  }

  if (trip.startDate) {
    return formatDate(trip.startDate);
  }

  if (trip.date) {
    return trip.date;
  }

  return '';
}

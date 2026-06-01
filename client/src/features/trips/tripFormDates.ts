import type { TripFormValues } from './TripForm';

export function normalizeDateForInput(value?: string | null): string {
  if (!value) {
    return '';
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}

function formatDateForApi(dateInput: string): string {
  const datePart = dateInput.slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    const parsed = new Date(dateInput);

    if (Number.isNaN(parsed.getTime())) {
      return dateInput;
    }

    return parsed.toISOString();
  }

  return new Date(`${datePart}T00:00:00.000Z`).toISOString();
}

function generateSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function buildDateLabel(startDate: string, endDate: string): string {
  if (startDate && endDate) {
    return `${startDate} — ${endDate}`;
  }

  return startDate || endDate || '';
}

export function buildTripFormSubmitValues(values: TripFormValues) {
  const startDate = values.startDate ? formatDateForApi(values.startDate) : '';
  const endDate = values.endDate ? formatDateForApi(values.endDate) : '';

  return {
    ...values,
    slug: generateSlug(values.title),
    date: buildDateLabel(startDate, endDate),
    startDate,
    endDate,
    publicDescription: values.description,
  };
}

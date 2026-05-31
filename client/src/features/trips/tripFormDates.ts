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

export function buildTripFormSubmitValues(
  values: TripFormValues,
): TripFormValues {
  return {
    ...values,
    startDate: values.startDate ? formatDateForApi(values.startDate) : '',
    endDate: values.endDate ? formatDateForApi(values.endDate) : '',
  };
}

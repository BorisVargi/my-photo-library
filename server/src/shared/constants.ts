export const VISIBILITY_VALUES = [
  'private',
  'public',
] as const;

export const STATUS_VALUES = [
  'draft',
  'published',
] as const;

export type Visibility = (typeof VISIBILITY_VALUES)[number];
export type Status = (typeof STATUS_VALUES)[number];

export const placeholder = 'placeholder';

export const propertyTypes = {
  MLT: 'MLT',
  OWN: 'OWN',
  SGL: 'SGL',
};

export const US_CODE = 'US';

export const DEFAULT_PROPERTY_VALUES = {
  name: '',
  latitude: 0,
  longitude: 0,
  altId: '',
  currency: null,
  multiUnit: null,
  location: {
    postalCode: '',
    country: null,
    region: '',
    city: '',
    street: '',
    displayExactLocation: true,
  },
};

export const DEFAULT_MLT_VALUES = {
  name: '',
  latitude: 0,
  persons: null,
  longitude: 0,
  altId: '',
  currency: null,
  multiUnit: 'MLT',
  parentId: null,
  location: {
    postalCode: '',
    country: null,
    region: '',
    city: '',
    street: '',
    displayExactLocation: true,
  },
};

export const SGL_TAB_NAMES = [
  'basicInfo',
  'bedConfig',
  'policies',
  'cancellationPolicies',
  'photos',
  'feesTaxes',
  'rates',
  'description',
  'amenities',
];

export const OWN_TAB_NAMES = [
  'basicInfo',
  'rooms',
  'policies',
  'cancellationPolicies',
  'photos',
  'feesTaxes',
  'description',
  'amenities',
];

export const BASIC_TABS = [
  'basicInfo',
  'policies',
  'cancellationPolicies',
  'photos',
  'feesTaxes',
  'description',
  'amenities',
];

export const CALENDAR_VIEW_TYPES = {
  REGULAR: 'regular',
  YEARLY: 'yearly',
};

export const CALENDAR_VIEW_NAMES = {
  regular: 'Regular view',
  yearly: 'Yearly calendar',
};

//@flow

import { isEmptyAddress } from '../../src';

const EMPTY_ADDRESSES = [
  ['null', null],
  ['undefined', undefined],
  ['empty object', {}],
  ['empty string', ''],
  ['full address with all empty subfields', {
    street1: '',
    street2: undefined,
    zip: null,
    country: '',
    city: '',
    state: '',
  }],
];

const NOT_EMPTY_ADDRESSES = [
  ['full address', {
    street1: 'Blessed',
    street2: 'Oliphant',
    zip: 'Turbinatoconcave',
    country: 'Interdine',
    city: 'Backbitingly',
    state: 'Muddybreast',
  }],
  ['partial address', {
    street1: '',
    street2: undefined,
    zip: null,
    country: 'Interdine',
    city: 'Backbitingly',
    state: 'Muddybreast',
  }],
];

it.each(EMPTY_ADDRESSES)('Should return `true` if address is empty (%s)', (name, value) => {
  expect(isEmptyAddress(value)).toBeTruthy();
});

it.each(NOT_EMPTY_ADDRESSES)('Should return `false` if address is not empty (%s)', (name, value) => {
  expect(isEmptyAddress(value)).toBeFalsy();
});

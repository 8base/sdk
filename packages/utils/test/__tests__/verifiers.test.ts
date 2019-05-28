
import { isEmptyAddress, isEmptyPhone } from '../../src';

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

const EMPTY_PHONES = [
  ['null', null],
  ['undefined', undefined],
  ['empty object', {}],
  ['empty string', ''],
  ['full phone with all empty subfields', {
    code: '',
    number: undefined,
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

const NOT_EMPTY_PHONES = [
  ['full phone', {
    code: '+78',
    number: '5637821',
  }],
  ['partial address', {
    code: '+78',
    number: '',
  }],
];

it.each<any>(EMPTY_ADDRESSES)('Should return `true` if address is empty (%s)', (name, value) => {
  expect(isEmptyAddress(value)).toBeTruthy();
});

it.each<any>(NOT_EMPTY_ADDRESSES)('Should return `false` if address is not empty (%s)', (name, value) => {
  expect(isEmptyAddress(value)).toBeFalsy();
});

it.each<any>(EMPTY_PHONES)('Should return `true` if phone is empty (%s)', (name, value) => {
  expect(isEmptyPhone(value)).toBeTruthy();
});

it.each<any>(NOT_EMPTY_PHONES)('Should return `false` if phone is not empty (%s)', (name, value) => {
  expect(isEmptyPhone(value)).toBeFalsy();
});

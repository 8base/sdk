import { validatorFacade } from './validator';
import defaultTo from 'ramda/es/defaultTo';

export * from './validator';
export const createValidate = validatorFacade;
export default createValidate;

console.log(createValidate);

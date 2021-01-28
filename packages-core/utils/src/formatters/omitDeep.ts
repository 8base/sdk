import * as R from 'ramda';

const omitDeep = (omitedProps: string[], objectForOmitting?: any) => {
  if (
    !objectForOmitting ||
    !R.is(Object, objectForOmitting) ||
    typeof objectForOmitting === 'number' ||
    typeof objectForOmitting === 'string'
  ) {
    return objectForOmitting;
  }

  const currentLevelOmitedObject: any = Array.isArray(objectForOmitting)
    ? R.map(value => omitDeep(omitedProps, value), objectForOmitting)
    : R.omit(omitedProps, objectForOmitting);

  const omitValue = (value: any): any => {
    if (R.is(Array, value)) {
      return value.map((item: any) => omitDeep(omitedProps, item));
    } else if (R.is(Object, value)) {
      return omitDeep(omitedProps, value);
    }
    return value;
  };

  const fullOmitedObject = Array.isArray(currentLevelOmitedObject)
    ? R.map(omitValue, currentLevelOmitedObject)
    : R.mapObjIndexed(omitValue, currentLevelOmitedObject);

  return fullOmitedObject;
};

export { omitDeep };

import * as R from 'ramda';

const omitDeep = (omitedProps: string[], objectForOmitting?: any) => {
  if (!objectForOmitting || !R.is(Object, objectForOmitting)) {
    return objectForOmitting;
  }

  const currentLevelOmitedObject = R.omit(omitedProps, objectForOmitting);

  const omitValue = (value: any): any => {
    if (R.is(Array, value)) {
      return value.map((item: any) => omitDeep(omitedProps, item));
    } else if (R.is(Object, value)) {
      return omitDeep(omitedProps, value);
    }
    return value;
  };

  const fullOmitedObject = R.mapObjIndexed(omitValue, currentLevelOmitedObject);

  return fullOmitedObject;
};

export { omitDeep };

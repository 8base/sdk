// @flow
import * as R from 'ramda';

export const getFragmentsSchema = async (uri: string): ?Object => {

  const result: Object = await fetch(uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      operationName: 'FragmentsSchema',
      query: `
        query FragmentsSchema {
          __schema {
            types {
              kind
              name
              possibleTypes {
                name
              }
            }
          }
        }
      `,
    }),
  })
    .then(result => result.json())
    .catch(() => ({ data: null }));

  if (R.isNil(result.data)) {
    return null;
  }

  const filteredData = result.data.__schema.types.filter(
    type => type.possibleTypes !== null,
  );

  result.data.__schema.types = filteredData;

  return result.data;
};

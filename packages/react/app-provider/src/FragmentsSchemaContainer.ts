import React from 'react';
import * as R from 'ramda';
import { PossibleTypesMap } from '@apollo/client';

type FragmentsSchemaContainerProps = {
  uri: string;
  children: (args: {
    loading: boolean;
    introspectionQueryResultData: object | null;
  }) => React.ReactNode;
};

type FragmentsSchemaContainerState = {
  loading: boolean;
  introspectionQueryResultData: null | Object;
};

class FragmentsSchemaContainer extends React.PureComponent<
  FragmentsSchemaContainerProps,
  FragmentsSchemaContainerState
> {
  public state: FragmentsSchemaContainerState = {
    introspectionQueryResultData: null,
    loading: true,
  };

  public async componentDidMount() {
    const { uri } = this.props;

    this.setState({ loading: true });

    const introspectionQueryResultData = await fetchFragmentsSchema(uri);

    this.setState({ loading: false, introspectionQueryResultData });
  }

  public render() {
    const { loading, introspectionQueryResultData } = this.state;
    const { children } = this.props;

    return children({ loading, introspectionQueryResultData });
  }
}

const fetchFragmentsSchema = async (uri: string): Promise<Object | null> => {
  const result: { data: any } = await fetch(uri, {
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
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
    .then((result) => result.json())
    .catch(() => ({ data: null }));

  if (R.isNil(result.data)) {
    return null;
  }

  const possibleTypes: PossibleTypesMap = {};

  result.data.__schema?.types?.forEach((supertype: any) => {
    if (supertype.possibleTypes) {
      possibleTypes[supertype.name] = supertype.possibleTypes.map(
        (subtype: any) => subtype.name,
      );
    }
  });

  return possibleTypes;
};

export { FragmentsSchemaContainer };

import React from 'react';
import * as R from 'ramda';

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

  const filteredData = result.data.__schema.types.filter(
    (type: any) => type.possibleTypes !== null,
  );

  result.data.__schema.types = filteredData;

  return result.data;
};

export { FragmentsSchemaContainer };

import * as React from 'react';
import * as R from 'ramda';

type FragmentsSchemaContainerProps = {
  uri: string,
  children: (args: { loading: boolean, fragmentsSchema: Object | null }) => React.ReactNode,
}

type FragmentsSchemaContainerState = {
  loading: boolean,
  fragmentsSchema: null | Object,

}

class FragmentsSchemaContainer extends React.PureComponent<FragmentsSchemaContainerProps, FragmentsSchemaContainerState> {
  state: FragmentsSchemaContainerState = {
    loading: true,
    fragmentsSchema: null,
  };

  async componentDidMount() {
    const { uri } = this.props;

    this.setState({ loading: true });

    const fragmentsSchema = await fetchFragmentsSchema(uri);

    this.setState({ loading: false, fragmentsSchema });
  }

  render() {
    const { loading, fragmentsSchema } = this.state;
    const { children } = this.props;

    return children({ loading, fragmentsSchema });
  }
}

const fetchFragmentsSchema = async (uri: string): Promise<Object | null> => {
  const result: { data: any } = await fetch(uri, {
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
  }).then(result => result.json()).catch(() => ({ data: null }));

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

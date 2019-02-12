import React from 'react';
import * as R from 'ramda';

class FragmentsSchemaContainer extends React.PureComponent {
  state = {
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

const fetchFragmentsSchema = async (uri: string): ?Object => {
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
  }).then(result => result.json()).catch(() => ({ data: null }));

  if (R.isNil(result.data)) {
    return null;
  }

  const filteredData = result.data.__schema.types.filter(
    type => type.possibleTypes !== null,
  );

  result.data.__schema.types = filteredData;

  return result.data;
};

export { FragmentsSchemaContainer };

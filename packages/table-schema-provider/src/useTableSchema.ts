import { useContext } from 'react';

import { TableSchemaContext } from './TableSchemaContext';

function useTableSchema() {
  const { tablesList, applicationsList, loading } = useContext(TableSchemaContext);

  return {
    tablesList,
    applicationsList,
    loading,
  };
}

export { useTableSchema };

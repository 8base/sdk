import { useContext } from 'react';

import { TableSchemaContext } from './TableSchemaContext';

function useTableSchema() {
  const { tablesList, applicationsList, loading, error } = useContext(TableSchemaContext);

  return {
    tablesList,
    applicationsList,
    loading,
    error,
  };
}

export { useTableSchema };

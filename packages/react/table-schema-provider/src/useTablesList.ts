import { useTableSchema } from './useTableSchema';

function useTablesList() {
  const { tablesList, loading, error } = useTableSchema();

  return {
    tablesList,
    loading,
    error,
  };
}

export { useTablesList };

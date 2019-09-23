import { useTableSchema } from './useTableSchema';

function useTablesList() {
  const { tablesList, loading } = useTableSchema();

  return {
    tablesList,
    loading,
  };
}

export { useTablesList };

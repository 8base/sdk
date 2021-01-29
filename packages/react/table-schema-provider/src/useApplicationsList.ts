import { useTableSchema } from './useTableSchema';

function useApplicationsList() {
  const { applicationsList, loading, error } = useTableSchema();

  return {
    applicationsList,
    loading,
    error,
  };
}

export { useApplicationsList };

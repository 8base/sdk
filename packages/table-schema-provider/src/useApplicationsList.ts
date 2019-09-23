import { useTableSchema } from './useTableSchema';

function useApplicationsList() {
  const { applicationsList, loading } = useTableSchema();

  return {
    applicationsList,
    loading,
  };
}

export { useApplicationsList };

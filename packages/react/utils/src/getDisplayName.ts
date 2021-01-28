export const getDisplayName = <T>(WrappedComponent: React.ComponentType<T>) =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

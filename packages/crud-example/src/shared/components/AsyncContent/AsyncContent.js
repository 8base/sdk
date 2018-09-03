import React from 'react';
import { Loader } from '@8base/boost';

const AsyncContent = ({ loading, children, ...props }) => {
  if (loading) {
    return <Loader { ...props } />;
  }

  return children;
};

export { AsyncContent };

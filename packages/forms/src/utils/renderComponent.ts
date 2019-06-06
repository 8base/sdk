import React from 'react';

import { logError } from './log';
import { RenderableProps } from '../types';

const renderComponent = (props: RenderableProps) => {
  const { render, children, component, ...rest } = props;

  let rendered = null;

  if (component) {
    rendered = React.createElement(component, { ...rest }, children);
  }

  if (render) {
    rendered = render({ ...rest, children });
  }

  if (typeof children === 'function') {
    rendered = children(rest);
  } else if (children) {
    rendered = children;
  } else {
    logError('must specify either a render prop, a render function as children, or a component prop.');
  }

  return rendered;
};

export { renderComponent };

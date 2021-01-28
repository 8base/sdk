import React from 'react';
import { FormContextValue } from './types';

const FormContext = React.createContext<FormContextValue>({});

export { FormContext };

import { mockRequest } from './utils';
import fetch from 'node-fetch';

global.mockRequest = mockRequest;
global.fetch = fetch;

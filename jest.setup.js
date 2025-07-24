/* eslint-disable @typescript-eslint/no-require-imports */
require('@testing-library/jest-dom');
const fetch = require('cross-fetch');

global.fetch = fetch;

import { TextDecoder, TextEncoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

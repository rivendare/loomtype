#!/usr/bin/env node

import { Loomtype } from './index.js';

const loomtype = new Loomtype();
loomtype.run(...process.argv.slice(2));

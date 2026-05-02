import { Log } from './dist/index.js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '../.env' });

async function test() {
  console.log('Testing Log with TOKEN:', process.env.ACCESS_TOKEN ? 'FOUND' : 'NOT FOUND');
  console.log('Testing Log...');
  const result = await Log('backend', 'info', 'handler', 'Logging system initialized');
  console.log('Log result:', result);
}

test();

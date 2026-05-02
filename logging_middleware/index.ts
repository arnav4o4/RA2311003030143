import axios from 'axios';

const LOG_URL = 'http://20.207.122.201/evaluation-service/logs';

export type Stack = 'backend' | 'frontend';
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type Package = 
  | 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' | 'repository' | 'route' | 'service'
  | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style'
  | 'auth' | 'config' | 'middleware' | 'utils';

// Helper to get token from env
const getToken = () => {
  try {
    // @ts-ignore
    return (typeof process !== 'undefined' && process.env) 
      // @ts-ignore
      ? (process.env.ACCESS_TOKEN || process.env.NEXT_PUBLIC_ACCESS_TOKEN) 
      : null;
  } catch {
    return null;
  }
};

export const Log = async (stack: Stack, level: Level, pkg: Package, message: string) => {
  const token = getToken();
  if (!token) {
    return;
  }

  try {
    const response = await axios.post(LOG_URL, {
      stack,
      level,
      package: pkg,
      message
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    // console.error('Logging failed');
  }
};

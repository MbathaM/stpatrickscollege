import { hc } from 'hono/client';

import { siteConfig } from '@/config/site';
import { type ApiType } from './index';
const origin = siteConfig.url as string;

export const client = hc<ApiType>(origin);
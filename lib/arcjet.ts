import 'server-only';

import arcjet, {
  detectBot,
  tokenBucket,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
} from '@arcjet/next';
import { env } from './env';

export {
  arcjet,
  detectBot,
  tokenBucket,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
};

// this will be called on every request every route handler in the app
export default arcjet({
  key: env.ARCJET_KEY,

  characteristics: ['fingerprint'],
  rules: [
    shield({
      mode: 'LIVE',
    }),
  ],
});

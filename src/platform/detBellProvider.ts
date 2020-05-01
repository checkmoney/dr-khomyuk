import { DetBell } from '@checkmoney/soap-opera';
import { Configuration } from '@solid-soda/config';

export const detBellProvider = {
  provide: DetBell,
  useFactory: (config: Configuration) => {
    const appSecret = config.getStringOrThrow('APP_SECRET');
    const serviceUrl = config.getStringOrThrow('DET_BELL_URL');

    return new DetBell(appSecret, serviceUrl);
  },
  inject: [Configuration],
};

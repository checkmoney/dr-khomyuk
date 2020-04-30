import { MrSolomons } from '@checkmoney/soap-opera';
import { Configuration } from '@solid-soda/config';

export const mrSolomonsProvider = {
  provide: MrSolomons,
  useFactory: (config: Configuration) => {
    const serviceUrl = config.getStringOrThrow('MR_SOLOMONS_URL');

    return new MrSolomons(serviceUrl);
  },
  inject: [Configuration],
};

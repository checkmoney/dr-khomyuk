import { MrButcher } from '@checkmoney/soap-opera';
import { Configuration } from '@solid-soda/config';

export const mrButcherProvider = {
  provide: MrButcher,
  useFactory: (config: Configuration) => {
    const serviceUrl = config.getStringOrThrow('MR_BUTCHER_URL');

    return new MrButcher(serviceUrl);
  },
  inject: [Configuration],
};

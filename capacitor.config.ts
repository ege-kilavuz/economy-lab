import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.egekilavuz.economylab',
  appName: 'Ekonomi Laboratuvarı',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    hostname: '127.0.0.1',
  },
};

export default config;

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gunswarm.game',
  appName: 'GunSwarm 3D',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
};

export default config;

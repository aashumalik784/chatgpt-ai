import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.wasmer.gpt',
  appName: 'Wasmer GPT',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

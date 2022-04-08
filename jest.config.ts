import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  coverageProvider: 'v8',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  roots: [
    'tests',
  ],
};

export default config;

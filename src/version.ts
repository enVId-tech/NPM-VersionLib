// Auto-generated version file
// Do not edit manually - this file is updated by scripts/generate-version.js

export const BUILD_VERSION = '25.10.01-dev.1';
export const BUILD_DATE = '2025-10-01T16:51:10.428Z';
export const BUILD_TIMESTAMP = 1759337470428;
export const BUILD_INFO = {
  version: BUILD_VERSION,
  date: BUILD_DATE,
  timestamp: BUILD_TIMESTAMP,
};

// Helper function to get readable build date
export const getBuildDateString = (): string => {
  return new Date(BUILD_TIMESTAMP).toLocaleDateString();
};

// Helper function to get version display string
export const getVersionDisplayString = (): string => {
  return (`v${BUILD_VERSION}`.split('-')[0]) ?? '';
};

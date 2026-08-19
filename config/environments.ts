/**
 * Environment-specific configuration.
 *
 * Extend this file when adding new test environments (staging, production, etc.).
 * All values should come from environment variables — never hardcode sensitive values.
 */

export interface EnvironmentConfig {
  baseURL: string;
  defaultUsername: string;
  defaultPassword: string;
  testEnv: string;
}

function getRequiredEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(
      `[Config] Required environment variable "${key}" is not set. ` +
        `Copy .env.example to .env and fill in your values.`,
    );
  }
  return value;
}

export const environmentConfig: EnvironmentConfig = {
  baseURL: getRequiredEnv('BASE_URL', 'https://www.saucedemo.com'),
  defaultUsername: getRequiredEnv('DEFAULT_USERNAME', 'standard_user'),
  defaultPassword: getRequiredEnv('DEFAULT_PASSWORD', 'secret_sauce'),
  testEnv: process.env.TEST_ENV ?? 'qa',
};

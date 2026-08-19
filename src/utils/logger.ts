/**
 * Lightweight logger for the SauceDemo test framework.
 *
 * Provides consistent, structured log output that helps trace test execution
 * without flooding the console with every Playwright action.
 *
 * SECURITY: Passwords and secrets must NEVER be passed to any logger method.
 */

const PREFIX = '[SauceDemo]';

function timestamp(): string {
  return new Date().toISOString();
}

export const logger = {
  /**
   * Log a named test step — call at the start of each logical test action.
   * @example logger.step('Adding product to cart', 'Sauce Labs Backpack');
   */
  step(action: string, detail?: string): void {
    const msg = detail ? `${action} → ${detail}` : action;
    console.info(`${PREFIX} [STEP] ${timestamp()} ${msg}`);
  },

  /**
   * Log general informational messages.
   */
  info(message: string): void {
    console.info(`${PREFIX} [INFO] ${timestamp()} ${message}`);
  },

  /**
   * Log non-fatal warnings.
   */
  warn(message: string): void {
    console.warn(`${PREFIX} [WARN] ${timestamp()} ${message}`);
  },

  /**
   * Log errors — do NOT include sensitive data.
   */
  error(message: string, error?: unknown): void {
    const detail = error instanceof Error ? error.message : String(error ?? '');
    console.error(`${PREFIX} [ERROR] ${timestamp()} ${message}${detail ? ` — ${detail}` : ''}`);
  },

  /**
   * Log test lifecycle events.
   */
  testStart(testTitle: string, user?: string): void {
    const userInfo = user ? ` | User: ${user}` : '';
    console.info(`${PREFIX} [TEST START] ${timestamp()} "${testTitle}"${userInfo}`);
  },

  testEnd(testTitle: string, status: 'passed' | 'failed' | 'skipped'): void {
    console.info(`${PREFIX} [TEST END] ${timestamp()} "${testTitle}" → ${status.toUpperCase()}`);
  },
};

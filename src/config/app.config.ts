/**
 * Application configuration and constants
 */

export const APP_CONFIG = {
  BASE_URL: 'https://www.saucedemo.com',
  DEFAULT_TIMEOUT: 30000,
  VIEWPORT_WIDTH: 1920,
  VIEWPORT_HEIGHT: 1080,
} as const;

/**
 * Valid test credentials
 */
export const TEST_CREDENTIALS = {
  STANDARD_USER: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  PROBLEM_USER: {
    username: 'problem_user',
    password: 'secret_sauce',
  },
  LOCKED_OUT_USER: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  PERFORMANCE_GLITCH_USER: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
  },
} as const;

/**
 * Page URL patterns
 */
export const PAGE_URLS = {
  LOGIN: '/',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TWO: '/checkout-step-two.html',
  CHECKOUT_COMPLETE: '/checkout-complete.html',
} as const;

/**
 * Common wait timeouts
 */
export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  VERY_LONG: 60000,
} as const;

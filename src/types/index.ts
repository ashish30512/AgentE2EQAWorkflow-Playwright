/**
 * Common types and interfaces used across the Page Object Model framework
 */

/**
 * User credentials interface
 */
export interface UserCredentials {
  username: string;
  password: string;
}

/**
 * Checkout form data interface
 */
export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/**
 * Product information interface
 */
export interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
}

/**
 * Cart item interface
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Order information interface
 */
export interface OrderInfo {
  items: CartItem[];
  subtotal: string;
  tax: string;
  total: string;
}

/**
 * Page navigation state
 */
export interface NavigationState {
  url: string;
  title: string;
}

/**
 * Test configuration interface
 */
export interface TestConfig {
  baseUrl: string;
  timeout: number;
  headless: boolean;
}

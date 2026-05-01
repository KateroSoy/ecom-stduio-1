/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  longDescription: string;
  sizes: string[];
  materials: string[];
  care: string[];
  images: string[];
  isNew?: boolean;
  isLimited?: boolean;
}

export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}

export type View = 'home' | 'product' | 'checkout' | 'shipping-returns' | 'success';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'urban-ease-sandal',
    name: 'Urban Ease Sandal',
    price: 349000,
    category: 'Footwear',
    description: 'Designed for daily rotation.',
    longDescription: 'A versatile silhouette crafted for comfort and longevity. The Urban Ease Sandal features a contoured footbed and durable straps, balancing utility with a refined aesthetic.',
    sizes: ['38', '39', '40', '41', '42', '43'],
    materials: ['Recycled Rubber', 'Microfiber Suede', 'Nylon Straps'],
    care: ['Wipe clean with a damp cloth.', 'Do not submerge in water.', 'Air dry only.'],
    images: [
      'https://images.unsplash.com/photo-1603487759148-9fbe44775871?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200'
    ],
    isNew: true
  },
  {
    id: 'mono-step-slide',
    name: 'Mono Step Slide',
    price: 299000,
    category: 'Footwear',
    description: 'Minimalist form, maximum mood.',
    longDescription: 'The Mono Step Slide is a study in restraint. With a single-piece construction and an oversized bridge, it offers a bold look for both home and city environments.',
    sizes: ['37', '38', '39', '40', '41', '42'],
    materials: ['EVA Foam', 'Matte Finish'],
    care: ['Hand wash with mild soap.', 'Avoid direct sunlight for prolonged periods.'],
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=1200'
    ],
    isLimited: true
  },
  {
    id: 'softline-daily-sandal',
    name: 'Softline Daily Sandal',
    price: 389000,
    category: 'Footwear',
    description: 'Built for daily ritual.',
    longDescription: 'Featuring a cushioned sole and soft-touch lining, the Softline Daily Sandal is meant to be worn all day. A subtle blend of athletic performance and editorial design.',
    sizes: ['39', '40', '41', '42', '43', '44'],
    materials: ['Synthetic Leather', 'Polyurethane Sole'],
    care: ['Use a leather conditioner occasionally.', 'Avoid salt water.'],
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1627315513076-2035ef1d4180?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    id: 'terra-form-strap',
    name: 'Terra Form Strap',
    price: 429000,
    category: 'Accessories',
    description: 'Objects for movement.',
    longDescription: 'The Terra Form Strap is an experimental accessory designed for modular use. Use it as a carrier, a belt, or a decorative element for your belongings.',
    sizes: ['OS'],
    materials: ['Technical Nylon', 'Zinc Alloy Hardware'],
    care: ['Machine wash cold in a laundry bag.', 'Drip dry.'],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1544816155-12df964ac73c?auto=format&fit=crop&q=80&w=1200'
    ],
    isNew: true
  },
  {
    id: 'weekend-grid-sandal',
    name: 'Weekend Grid Sandal',
    price: 319000,
    category: 'Footwear',
    description: 'Structure and play.',
    longDescription: 'A graphic approach to the classic sandal. The grid-inspired strap system provides both micro-adjustability and a distinctive visual signature.',
    sizes: ['38', '39', '40', '41', '42'],
    materials: ['Webbing strap', 'Rubber Sole'],
    care: ['Scrub with a soft brush.', 'Rinse with fresh water.'],
    images: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512374382149-433a727a2f9b?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    id: 'quiet-motion-mule',
    name: 'Quiet Motion Mule',
    price: 459000,
    category: 'Footwear',
    description: 'Refined silence.',
    longDescription: 'The Quiet Motion Mule elevates the concept of indoor-outdoor wear. With a high-walled sole and a sleek upper, it offers privacy and style in equal measure.',
    sizes: ['40', '41', '42', '43', '44', '45'],
    materials: ['Polished Leather', 'Cork Midsole'],
    care: ['Professional leather clean only.', 'Avoid moisture.'],
    images: [
      'https://images.unsplash.com/photo-1588117305388-c2631a279f82?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1616406432451-4243bd3744fb?auto=format&fit=crop&q=80&w=1200'
    ],
    isLimited: true
  }
];

export const BRAND_NAME = 'STUDIO RITUAL';
export const BRAND_TAGLINE = 'Objects for movement, mood, and everyday ritual.';

export const SHIPPING_FAQ = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 2-4 business days for major cities in Indonesia. Inter-island shipping may take 5-7 days.' },
  { q: 'Can I track my order?', a: 'Yes, a tracking number will be sent to your WhatsApp after dispatch.' },
  { q: 'Do you ship internationally?', a: 'Currently we only ship within Indonesia. International shipping is coming soon.' }
];

export const PAYMENTS_FAQ = [
  { q: 'What payment methods do you accept?', a: 'We accept Manual Bank Transfer (BCA, Mandiri), QRIS, and E-wallets (GoPay, OVO, ShopeePay).' },
  { q: 'How do I verify my payment?', a: 'After transferring, please upload your proof of payment on the order confirmation page or send it via our official WhatsApp.' }
];

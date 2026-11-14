import { writable } from 'svelte/store';
import { browser } from '$app/env';

const initialCart = browser && localStorage.getItem('parqis_cart')
  ? JSON.parse(localStorage.getItem('parqis_cart'))
  : [
      {
        id: 'prod_1',
        title: 'Women Solids Tank top',
        price: 349,
        compareAtPrice: 1199,
        discountPercent: 71,
        image: '/images/1792739016099-0orsgt.jpg',
        size: 'M',
        color: 'black',
        quantity: 2,
        selected: true
      }
    ];

export const cart = writable(initialCart);

if (browser) {
  cart.subscribe((val) => {
    localStorage.setItem('parqis_cart', JSON.stringify(val));
  });
}

export function addToCart(product, size = 'M') {
  cart.update((items) => {
    const existing = items.find((i) => i.id === product.id && i.size === size);
    if (existing) {
      existing.quantity += 1;
      return [...items];
    }
    return [
      ...items,
      {
        ...product,
        size,
        color: product.color || 'Standard',
        quantity: 1,
        selected: true
      }
    ];
  });
}

export function updateQuantity(id, size, delta) {
  cart.update((items) => {
    return items
      .map((item) => {
        if (item.id === id && item.size === size) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
  });
}

export function toggleSelect(id, size) {
  cart.update((items) =>
    items.map((item) => {
      if (item.id === id && item.size === size) {
        return { ...item, selected: !item.selected };
      }
      return item;
    })
  );
}

export function clearCart() {
  cart.set([]);
}

import { writable } from 'svelte/store';
import { browser } from '$app/env';

const storedUser = browser && localStorage.getItem('parqis_user')
  ? JSON.parse(localStorage.getItem('parqis_user'))
  : null;

export const user = writable(storedUser);

if (browser) {
  user.subscribe((val) => {
    if (val) {
      localStorage.setItem('parqis_user', JSON.stringify(val));
    } else {
      localStorage.removeItem('parqis_user');
    }
  });
}

export function loginWithPhone(phone) {
  const newUser = {
    phone,
    isAuthenticated: true,
    fullName: '',
    email: '',
    username: ''
  };
  user.set(newUser);
  return newUser;
}

export function updateProfile(details) {
  user.update((curr) => ({
    ...(curr || {}),
    ...details,
    isAuthenticated: true
  }));
}

export function logout() {
  user.set(null);
}

<script>
  import { user, logout } from '$lib/stores/user.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    if (!$user?.isAuthenticated) {
      goto('/auth/login');
    }
  });

  function handleLogout() {
    logout();
    goto('/');
  }
</script>

<div class="flex flex-col w-full min-h-screen bg-gray-50 pb-20">
  <div class="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <a href="/" class="text-gray-600 hover:text-black" aria-label="Back to Home">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </a>
      <h1 class="text-lg font-bold text-gray-900">My Account</h1>
    </div>
    <button on:click={handleLogout} class="text-xs text-rose-600 font-bold hover:underline">
      Log out
    </button>
  </div>

  <div class="p-4 max-w-lg mx-auto w-full space-y-4">
    <!-- User Profile Header -->
    <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex items-center gap-4">
      <div class="w-14 h-14 rounded-full bg-[#A70F2F] text-white flex items-center justify-center font-black text-xl shadow">
        {$user?.fullName ? $user.fullName[0].toUpperCase() : 'U'}
      </div>
      <div>
        <h2 class="text-base font-bold text-gray-900">{$user?.fullName || 'PARQIS Member'}</h2>
        <p class="text-xs text-gray-500 font-medium">+91 {$user?.phone || 'Not provided'}</p>
        <span class="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
          ✓ Verified Account
        </span>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 shadow-xs">
      <a href="/cart" class="flex items-center justify-between p-4 hover:bg-gray-50 transition">
        <div class="flex items-center gap-3">
          <span class="text-gray-400">🛍️</span>
          <span class="text-xs font-semibold text-gray-800">My Cart</span>
        </div>
        <span class="text-gray-400 text-xs">&gt;</span>
      </a>

      <a href="/cart/address" class="flex items-center justify-between p-4 hover:bg-gray-50 transition">
        <div class="flex items-center gap-3">
          <span class="text-gray-400">📍</span>
          <span class="text-xs font-semibold text-gray-800">Saved Addresses</span>
        </div>
        <span class="text-gray-400 text-xs">&gt;</span>
      </a>

      <a href="/trends" class="flex items-center justify-between p-4 hover:bg-gray-50 transition">
        <div class="flex items-center gap-3">
          <span class="text-gray-400">🔥</span>
          <span class="text-xs font-semibold text-gray-800">Trending Videos &amp; Reels</span>
        </div>
        <span class="text-gray-400 text-xs">&gt;</span>
      </a>
    </div>
  </div>
</div>

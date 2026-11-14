<script>
  import { cart } from '$lib/stores/cart.js';
  import { user, logout } from '$lib/stores/user.js';
  import { page } from '$app/state';

  let cartCount = $derived($cart.reduce((sum, item) => sum + item.quantity, 0));
  let searchQuery = $state('');

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/categories?q=${encodeURIComponent(searchQuery)}`;
    }
  }
</script>

<div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
  <!-- Brand Logo -->
  <a href="/" class="flex items-center gap-2">
    <div class="h-8 w-8 bg-[#A70F2F] rounded flex items-center justify-center text-white font-black text-lg tracking-wider">
      P
    </div>
    <span class="text-2xl font-black tracking-tight text-gray-900">PARQIS</span>
  </a>

  <!-- Navigation Links -->
  <nav class="flex items-center gap-6 text-sm font-semibold text-gray-700">
    <a href="/" class="hover:text-[#A70F2F] transition-colors {page.url.pathname === '/' ? 'text-[#A70F2F]' : ''}">Home</a>
    <a href="/trends" class="hover:text-[#A70F2F] transition-colors {page.url.pathname.startsWith('/trends') ? 'text-[#A70F2F]' : ''}">Trends</a>
    <a href="/categories?cat=ETHNIC" class="hover:text-[#A70F2F] transition-colors">Ethnic</a>
    <a href="/categories?cat=WESTERN" class="hover:text-[#A70F2F] transition-colors">Western</a>
    <a href="/categories?cat=MEN" class="hover:text-[#A70F2F] transition-colors">Men</a>
  </nav>

  <!-- Search Input -->
  <form onsubmit={handleSearch} class="flex-1 max-w-md relative">
    <input 
      type="text" 
      bind:value={searchQuery}
      placeholder="Search for products, creators..." 
      class="w-full h-10 pl-10 pr-4 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#A70F2F]/30 border border-transparent focus:border-[#A70F2F] transition"
    />
    <svg class="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </form>

  <!-- Right Actions: Cart & Auth -->
  <div class="flex items-center gap-5">
    <a href="/cart" class="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-[#A70F2F] transition relative">
      <div class="relative">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {#if cartCount > 0}
          <span class="absolute -top-1.5 -right-2 bg-[#A70F2F] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        {/if}
      </div>
      <span>Cart</span>
    </a>

    {#if $user?.isAuthenticated}
      <div class="flex items-center gap-3">
        <span class="text-sm font-semibold text-gray-800">
          {$user.fullName || $user.phone || 'User'}
        </span>
        <button 
          onclick={logout}
          class="text-xs text-rose-600 border border-rose-200 px-2.5 py-1 rounded hover:bg-rose-50 transition"
        >
          Logout
        </button>
      </div>
    {:else}
      <a 
        href="/auth/login" 
        class="bg-[#A70F2F] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-[#8F0D28] transition shadow-xs"
      >
        Login
      </a>
    {/if}
  </div>
</div>

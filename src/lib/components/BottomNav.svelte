<script>
  import { page } from '$app/state';
  import { cart } from '$lib/stores/cart.js';
  import { user } from '$lib/stores/user.js';

  let currentPath = $derived(page.url.pathname);
  let cartCount = $derived($cart.reduce((sum, item) => sum + item.quantity, 0));
</script>

<div class="w-full bg-white border-t border-gray-200 py-2 px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
  <div class="max-w-[480px] mx-auto flex items-center justify-around">
    <!-- Home -->
    <a 
      href="/" 
      class="flex flex-col items-center gap-1 transition-colors {currentPath === '/' ? 'text-[#A70F2F]' : 'text-gray-500 hover:text-black'}"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span class="text-[10px] font-medium">Home</span>
    </a>

    <!-- Trends / Reels -->
    <a 
      href="/trends" 
      class="flex flex-col items-center gap-1 transition-colors {currentPath.startsWith('/trends') ? 'text-[#A70F2F]' : 'text-gray-500 hover:text-black'}"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="text-[10px] font-medium">Trends</span>
    </a>

    <!-- Categories -->
    <a 
      href="/categories" 
      class="flex flex-col items-center gap-1 transition-colors {currentPath.startsWith('/categories') ? 'text-[#A70F2F]' : 'text-gray-500 hover:text-black'}"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
      </svg>
      <span class="text-[10px] font-medium">Categories</span>
    </a>

    <!-- Cart -->
    <a 
      href="/cart" 
      class="flex flex-col items-center gap-1 relative transition-colors {currentPath.startsWith('/cart') ? 'text-[#A70F2F]' : 'text-gray-500 hover:text-black'}"
    >
      <div class="relative">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {#if cartCount > 0}
          <span class="absolute -top-1.5 -right-2 bg-[#A70F2F] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {cartCount}
          </span>
        {/if}
      </div>
      <span class="text-[10px] font-medium">Cart</span>
    </a>

    <!-- Account / Auth -->
    <a 
      href={$user?.isAuthenticated ? "/profile" : "/auth/login"} 
      class="flex flex-col items-center gap-1 transition-colors {currentPath.startsWith('/auth') || currentPath.startsWith('/profile') ? 'text-[#A70F2F]' : 'text-gray-500 hover:text-black'}"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span class="text-[10px] font-medium">{$user?.isAuthenticated ? 'Account' : 'Login'}</span>
    </a>
  </div>
</div>

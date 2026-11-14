<script>
  import { onMount } from 'svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import { cart } from '$lib/stores/cart.js';

  let products = [];
  let filteredProducts = [];
  let selectedCategory = 'ALL';
  let searchQuery = '';

  const categories = ['ALL', 'ETHNIC', 'WESTERN', 'MEN', 'Festive Fashion', 'Everyday Fits'];

  onMount(async () => {
    try {
      const res = await fetch('/data/products.json');
      if (res.ok) {
        products = await res.json();
      }
    } catch (e) {
      console.warn('Failed to load products.json, using fallback');
    }

    if (!products.length) {
      // Fallback initial products
      products = [
        { id: '1', title: 'Women Solids Tank top', price: 349, compareAtPrice: 1199, discountPercent: 71, image: '/images/1792739016099-0orsgt.jpg', category: 'WESTERN' },
        { id: '2', title: 'Men Solids Polo T-Shirt', price: 205, compareAtPrice: 1399, discountPercent: 85, image: '/images/1788955741707-46ope6.jpg', category: 'MEN' },
        { id: '3', title: 'Men Solids Pullover 2XL', price: 449, compareAtPrice: 1399, discountPercent: 68, image: '/images/1788955958023-s4pjt1.jpg', category: 'MEN' },
        { id: '4', title: 'Festive Silk Embroidered Kurta Set', price: 1299, compareAtPrice: 3999, discountPercent: 67, image: '/images/1788956043942-4abvug.jpg', category: 'ETHNIC' }
      ];
    }
    filterProducts();
  });

  $: if (selectedCategory || searchQuery) {
    filterProducts();
  }

  function filterProducts() {
    let result = products;
    if (selectedCategory !== 'ALL') {
      result = result.filter(p => 
        (p.category && p.category.toUpperCase() === selectedCategory) ||
        (selectedCategory === 'Festive Fashion' && p.category === 'ETHNIC') ||
        (selectedCategory === 'Everyday Fits' && p.category === 'WESTERN')
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    filteredProducts = result;
  }
</script>

<div class="flex flex-col w-full">
  <!-- Mobile Top Header (Hidden on lg+ desktop) -->
  <div class="lg:hidden p-4 pb-2 bg-white sticky top-0 z-40 border-b border-gray-100">
    <!-- Delivery Address Selector -->
    <a href="/cart/address" class="flex items-center gap-1.5 text-xs text-gray-700 font-medium mb-3">
      <svg class="w-4 h-4 text-[#A70F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span>Deliver to: <strong class="text-black font-semibold">Home, Rourkela 769008</strong></span>
      <span class="text-gray-400">&gt;</span>
    </a>

    <!-- Search Bar -->
    <div class="relative">
      <input 
        type="text" 
        bind:value={searchQuery}
        placeholder="Search for products, creators..." 
        class="w-full h-10 pl-9 pr-4 rounded-md bg-gray-100 text-xs focus:outline-none focus:ring-1 focus:ring-[#A70F2F] placeholder:text-gray-400"
      />
      <svg class="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>

  <!-- Category Pills Scroller -->
  <div class="px-4 py-3 bg-white border-b border-gray-100 overflow-x-auto no-scrollbar flex items-center gap-2">
    {#each categories as cat}
      <button 
        type="button"
        on:click={() => selectedCategory = cat}
        class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all {selectedCategory === cat ? 'bg-[#A70F2F] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
      >
        {cat}
      </button>
    {/each}
  </div>

  <!-- Hero Promo Banner -->
  <div class="p-4">
    <div class="relative w-full aspect-[21/9] sm:aspect-[24/7] bg-gradient-to-r from-rose-900 via-rose-800 to-indigo-950 rounded-xl overflow-hidden shadow-sm flex items-center p-6 text-white">
      <div class="max-w-md z-10">
        <span class="text-[10px] uppercase font-bold tracking-widest text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded">Seasonal Deals</span>
        <h2 class="text-xl sm:text-3xl font-black mt-1 leading-tight">Your Coolest Finds Ahead!</h2>
        <p class="text-xs sm:text-sm text-rose-100 mt-1 opacity-90">Up to 85% off trendsetting styles & college picks.</p>
        <a href="/trends" class="mt-3 inline-flex items-center gap-1.5 bg-white text-rose-900 text-xs font-bold px-3.5 py-1.5 rounded shadow hover:bg-rose-50 transition">
          <span>Watch Reels & Shop</span>
          <span>&rarr;</span>
        </a>
      </div>
      <div class="absolute right-0 bottom-0 opacity-20 pointer-events-none text-9xl font-black select-none">
        PARQIS
      </div>
    </div>
  </div>

  <!-- Section Header -->
  <div class="px-4 pb-2 flex items-center justify-between">
    <div>
      <h2 class="text-base sm:text-lg font-bold text-gray-900">Trending Now</h2>
      <p class="text-xs text-gray-500">Curated social picks and latest arrivals</p>
    </div>
    <span class="text-xs font-medium text-gray-400">{filteredProducts.length} items</span>
  </div>

  <!-- Products Grid: 2 columns on mobile, 3 on tablet, 4 on desktop -->
  <div class="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
    {#each filteredProducts as product (product.id)}
      <ProductCard {product} />
    {/each}
  </div>
</div>

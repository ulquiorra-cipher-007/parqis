<script>
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import ProductCard from '$lib/components/ProductCard.svelte';

  let products = [];
  let filtered = [];
  let activeCategory = 'ALL';
  let sortBy = 'popular'; // 'popular' | 'price_asc' | 'price_desc'

  const categories = ['ALL', 'ETHNIC', 'WESTERN', 'MEN'];

  onMount(async () => {
    // Check url search params for initial category
    const catParam = page.url.searchParams.get('cat');
    if (catParam) activeCategory = catParam.toUpperCase();

    try {
      const res = await fetch('/data/products.json');
      if (res.ok) {
        products = await res.json();
      }
    } catch (e) {
      console.warn('Failed to load products');
    }
    applyFilter();
  });

  $: if (activeCategory || sortBy) {
    applyFilter();
  }

  function applyFilter() {
    let list = [...products];
    if (activeCategory !== 'ALL') {
      list = list.filter(p => p.category && p.category.toUpperCase() === activeCategory);
    }
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    }
    filtered = list;
  }
</script>

<div class="flex flex-col w-full min-h-screen bg-white pb-20">
  <!-- Top Header -->
  <div class="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-40">
    <div class="flex items-center gap-3">
      <a href="/" class="text-gray-600 hover:text-black" aria-label="Back to Home">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </a>
      <h1 class="text-lg font-bold text-gray-900">Categories</h1>
    </div>
    <span class="text-xs text-gray-500 font-semibold">{filtered.length} products</span>
  </div>

  <!-- Filters & Sorting Bar -->
  <div class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
    <!-- Category Tabs -->
    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
      {#each categories as cat}
        <button 
          on:click={() => activeCategory = cat}
          class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition {activeCategory === cat ? 'bg-[#A70F2F] text-white' : 'bg-white border border-gray-200 text-gray-700'}"
        >
          {cat}
        </button>
      {/each}
    </div>

    <!-- Sort Dropdown -->
    <select 
      bind:value={sortBy}
      class="text-xs font-semibold bg-white border border-gray-200 rounded px-2.5 py-1.5 outline-none cursor-pointer"
    >
      <option value="popular">Popular</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </select>
  </div>

  <!-- Product Grid -->
  <div class="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
    {#each filtered as product (product.id)}
      <ProductCard {product} />
    {/each}
  </div>
</div>

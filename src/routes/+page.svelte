<script>
  import { onMount, onDestroy } from 'svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import { cart } from '$lib/stores/cart.js';
  import { user } from '$lib/stores/user.js';

  let products = $state([]);
  let selectedCategory = $state('ALL');
  let searchQuery = $state('');
  let currentBannerIndex = $state(0);
  let showAddressModal = $state(false);
  let bannerTimer = null;

  const categories = ['ALL', 'ETHNIC', 'WESTERN', 'MEN'];

  const stories = [
    { name: 'Festive\nFashion', image: '/images/Frame_664-1793751403087-vc2o63.png', category: 'ETHNIC' },
    { name: 'Everyday\nFits', image: '/images/Group_291-1793752047649-lb7g84.png', category: 'WESTERN' },
    { name: "Men's\nSweatshirts", image: '/images/de4ec9bb-6375-4d37-b511-7fd647a8b6c4-1793755899799-zny1ly.png', category: 'MEN' },
    { name: 'Crop\nTops', image: '/images/Group_283-1793752045025-4c6k6j.png', category: 'WESTERN' },
    { name: 'Ethnic\nFusion', image: '/images/Frame_666-1793751404918-qpvwjv.png', category: 'ETHNIC' },
    { name: 'Hoodies', image: '/images/2b58c93e-b304-4f53-96e3-dbeecd3ee2ca-1793755898877-uyms6m.png', category: 'MEN' }
  ];

  const banners = [
    '/images/1794620848219-02o6sp.png',
    '/images/1793741121017-gspn7b.png',
    '/images/1793743502160-0x12te.png',
    '/images/1793740942517-beaod0.png',
    '/images/1793741872859-fgjm98.png',
    '/images/1793743529193-wc3ebl.png'
  ];

  onMount(async () => {
    try {
      const res = await fetch('/data/products.json');
      if (res.ok) {
        products = await res.json();
      }
    } catch (err) {
      console.warn('Could not load products.json:', err);
    }

    bannerTimer = setInterval(() => {
      currentBannerIndex = (currentBannerIndex + 1) % banners.length;
    }, 4500);
  });

  onDestroy(() => {
    if (bannerTimer) clearInterval(bannerTimer);
  });

  let filteredProducts = $derived(() => {
    let list = products;
    if (selectedCategory !== 'ALL') {
      list = list.filter(p => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q)));
    }
    return list;
  });

  let collegeReady = $derived(() => {
    return products.slice(0, 6);
  });

  let pulloverStyle = $derived(() => {
    return products.filter(p => p.title.toLowerCase().includes('pullover') || p.title.toLowerCase().includes('sweatshirt')).slice(0, 6);
  });

  let festivePicks = $derived(() => {
    return products.filter(p => p.category === 'ETHNIC' || p.title.toLowerCase().includes('printed') || p.title.toLowerCase().includes('crop')).slice(0, 6);
  });

  let trendingFits = $derived(() => {
    return products.slice(6, 14);
  });
</script>

<div class="flex flex-col w-full pb-24 overflow-x-hidden">
  <!-- FESTIVE HERO HEADER (Deep Purple with Hanging Fairy Lights) -->
  <div class="relative w-full bg-[#23143e] overflow-hidden text-white pt-2.5 pb-4">
    <!-- Fairy lights decorative background -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-[-15px] z-0 select-none">
      <img 
        alt="" 
        src="/festive/festive-header-bg.png" 
        class="w-full h-auto select-none opacity-95 block"
      />
    </div>

    <!-- Header Content Container -->
    <div class="relative z-10 px-4">
      <!-- Top Row: Address Selector + Wishlist & Account Icons -->
      <div class="flex items-center justify-between text-white">
        <!-- Address Selector Button -->
        <button 
          type="button" 
          onclick={() => showAddressModal = true}
          class="flex items-center gap-1.5 rounded-[8px] py-1 text-left text-[12px] font-semibold transition text-white hover:bg-white/10 active:scale-95"
          aria-label="Select delivery address"
        >
          <svg class="h-4 w-4 shrink-0 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="truncate max-w-[180px] sm:max-w-xs">Select an address</span>
          <svg class="h-3.5 w-3.5 shrink-0 text-white/80" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <!-- Wishlist and Account Icons -->
        <div class="flex items-center gap-4">
          <a 
            href="/categories" 
            class="relative cursor-pointer transition hover:opacity-85 active:scale-95"
            aria-label="Wishlist"
          >
            <img alt="Wishlist" class="h-[19px] w-[19px] object-contain" src="/home-like.svg" />
          </a>
          <a 
            href={$user?.isAuthenticated ? "/profile" : "/auth/login"} 
            class="cursor-pointer transition hover:opacity-85 active:scale-95"
            aria-label="Account"
          >
            <img alt="User" class="h-[21px] w-[21px] object-contain" src="/home-user.svg" />
          </a>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="mt-3 flex h-9 w-full items-center gap-2 rounded-[4px] border border-white/30 px-3 text-white transition hover:bg-white/5 focus-within:border-white/60 focus-within:bg-white/10">
        <svg class="h-3.5 w-3.5 text-white/70 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.34-4.34" />
        </svg>
        <input 
          type="text" 
          bind:value={searchQuery}
          placeholder="Search for products, creators..." 
          class="w-full bg-transparent text-[12px] text-white placeholder:text-white/70 outline-none"
        />
        {#if searchQuery}
          <button type="button" onclick={() => searchQuery = ''} class="text-white/60 hover:text-white text-xs">
            ✕
          </button>
        {/if}
      </div>

      <!-- Category Navigation Tabs (ALL, ETHNIC, WESTERN, MEN) -->
      <div class="relative flex items-center justify-between text-xs scrollbar-none py-3 mt-1">
        {#each categories as cat}
          <button 
            type="button"
            onclick={() => selectedCategory = cat}
            class="relative z-10 cursor-pointer rounded-[40px] px-5 py-[7px] text-xs font-semibold tracking-wide transition-all active:scale-[0.98] {selectedCategory === cat ? 'bg-white/15 border-[0.5px] border-white/80 text-white shadow-[inset_0_0px_2px_rgba(255,255,255,1)] backdrop-blur-md' : 'text-white/80 hover:text-white bg-transparent'}"
          >
            {cat}
          </button>
        {/each}
      </div>

      <!-- Category Story Highlights (Arch-Framed Icons) -->
      <div class="mt-1 flex gap-3 items-start overflow-x-auto pb-1 scrollbar-none">
        {#each stories as story}
          <button 
            type="button"
            onclick={() => { selectedCategory = story.category; }}
            class="flex flex-col items-center justify-start w-[72px] shrink-0 cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 text-white"
          >
            <div class="size-[70px] rounded-full overflow-hidden flex items-center justify-center transition-transform hover:scale-105">
              <img 
                alt={story.name} 
                class="size-full object-cover" 
                src={story.image} 
              />
            </div>
            <p class="mt-1.5 text-center text-[12px] leading-tight text-white whitespace-pre-line">
              {story.name}
            </p>
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- MAIN BODY CONTENT -->
  <main class="relative z-10 px-4 pt-3 flex flex-col gap-6 bg-white">
    <!-- If User is Searching: Display Live Search Grid -->
    {#if searchQuery.trim()}
      <section class="mt-2">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-bold text-gray-900">Search Results</h2>
          <span class="text-xs text-gray-500">{filteredProducts().length} found</span>
        </div>
        {#if filteredProducts().length === 0}
          <div class="text-center py-12 text-gray-400 text-sm">
            No products matching "{searchQuery}".
          </div>
        {:else}
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {#each filteredProducts() as product (product.id)}
              <ProductCard {product} />
            {/each}
          </div>
        {/if}
      </section>
    {:else}

      <!-- HERO BANNER CAROUSEL (Diwali Drip Sale + Campus Ready 60% OFF) -->
      <section class="relative w-full overflow-hidden rounded-[8px] bg-gray-100 shadow-xs">
        <div class="relative w-full overflow-hidden aspect-[2464/1728] sm:aspect-[21/9]">
          <a href="/categories" class="block w-full h-full select-none cursor-pointer">
            <img 
              alt="PARQIS Festive Banner" 
              class="w-full h-full object-cover block transition-opacity duration-300" 
              src={banners[currentBannerIndex]} 
            />
          </a>
        </div>

        <!-- Carousel Pagination Dots (6 Dots) -->
        <div class="flex items-center justify-center gap-1.5 py-2.5 bg-white">
          {#each banners as _, idx}
            <button 
              type="button"
              onclick={() => currentBannerIndex = idx}
              aria-label="Go to slide {idx + 1}"
              class="transition-all duration-300 cursor-pointer {idx === currentBannerIndex ? 'w-4 h-1.5 rounded-full bg-black/85' : 'size-1.5 rounded-full bg-black/25 hover:bg-black/40'}"
            ></button>
          {/each}
        </div>
      </section>

      <!-- SECTION 1: "College Ready" (Exact Screenshot Replication) -->
      <section class="w-full">
        <div class="flex items-center justify-between mb-2.5">
          <h3 class="text-xl font-bold leading-none text-[#4A4640]">College Ready</h3>
          <a href="/categories" class="cursor-pointer text-sm font-semibold text-[#A92645] transition hover:opacity-75 active:scale-[0.98]">
            View more <span class="text-[17px] font-semibold">&gt;</span>
          </a>
        </div>

        <!-- Horizontal Scrolling Cards with Floating Add-to-Cart -->
        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {#each collegeReady() as prod (prod.id)}
            <div class="w-[115px] sm:w-[130px] shrink-0">
              <ProductCard product={prod} />
            </div>
          {/each}
        </div>
      </section>

      <!-- SECTION 2: "Pull over in Style" -->
      <section class="w-full">
        <div class="flex items-center justify-between mb-2.5">
          <h3 class="text-xl font-bold leading-none text-[#4A4640]">Pull over in Style</h3>
          <a href="/categories" class="cursor-pointer text-sm font-semibold text-[#A92645] transition hover:opacity-75 active:scale-[0.98]">
            View more <span class="text-[17px] font-semibold">&gt;</span>
          </a>
        </div>

        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {#each pulloverStyle() as prod (prod.id)}
            <div class="w-[115px] sm:w-[130px] shrink-0">
              <ProductCard product={prod} />
            </div>
          {/each}
        </div>
      </section>

      <!-- SECTION 3: "Patakha Fits, Killer Deals" -->
      <section class="w-full">
        <div class="flex items-center justify-between mb-2.5">
          <h3 class="text-xl font-bold leading-none text-[#4A4640]">Patakha Fits, Killer Deals</h3>
          <a href="/categories" class="cursor-pointer text-sm font-semibold text-[#A92645] transition hover:opacity-75 active:scale-[0.98]">
            View more <span class="text-[17px] font-semibold">&gt;</span>
          </a>
        </div>

        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {#each festivePicks() as prod (prod.id)}
            <div class="w-[115px] sm:w-[130px] shrink-0">
              <ProductCard product={prod} />
            </div>
          {/each}
        </div>
      </section>

      <!-- SECTION 4: "Trending Fits" (Multi-Column Grid) -->
      <section class="w-full mt-2">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xl font-bold leading-none text-[#4A4640]">Trending Fits</h3>
          <a href="/categories" class="cursor-pointer text-sm font-semibold text-[#A92645] transition hover:opacity-75 active:scale-[0.98]">
            View more <span class="text-[17px] font-semibold">&gt;</span>
          </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {#each trendingFits() as prod (prod.id)}
            <ProductCard product={prod} />
          {/each}
        </div>
      </section>

    {/if}
  </main>
</div>

<!-- ADDRESS SELECTOR MODAL -->
{#if showAddressModal}
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4">
    <div class="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl transition-all">
      <div class="flex items-center justify-between border-b border-gray-100 pb-3">
        <h4 class="text-base font-bold text-gray-900">Select Delivery Location</h4>
        <button 
          type="button" 
          onclick={() => showAddressModal = false}
          class="text-gray-400 hover:text-gray-700 p-1"
        >
          ✕
        </button>
      </div>

      <div class="py-4 space-y-3">
        <div class="flex items-start gap-3 p-3 rounded-xl border-2 border-[#A92645] bg-rose-50/50 cursor-pointer">
          <div class="mt-0.5 size-4 rounded-full border-4 border-[#A92645] bg-white"></div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-gray-900">Home</span>
              <span class="text-[10px] bg-[#A92645] text-white px-1.5 py-0.2 rounded font-semibold">DEFAULT</span>
            </div>
            <p class="text-xs text-gray-600 mt-1">NIT Rourkela Campus, Sector 1, Rourkela, Odisha - 769008</p>
          </div>
        </div>

        <a 
          href="/cart/address" 
          onclick={() => showAddressModal = false}
          class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-gray-300 text-xs font-bold text-[#A92645] hover:bg-gray-50 transition"
        >
          <span>+ Add New Address</span>
        </a>
      </div>

      <button 
        type="button" 
        onclick={() => showAddressModal = false}
        class="w-full py-2.5 rounded-xl bg-[#A92645] text-white text-xs font-bold shadow-md hover:bg-[#8e1f3a] transition"
      >
        Deliver Here
      </button>
    </div>
  </div>
{/if}
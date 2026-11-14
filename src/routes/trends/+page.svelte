<script>
  import { onMount } from 'svelte';
  import { addToCart } from '$lib/stores/cart.js';
  import { goto } from '$app/navigation';

  let reels = [
    {
      id: 'r1',
      title: 'Everyday Minimalist Fit',
      creator: '@parqis_style',
      likes: 1240,
      shares: 88,
      liked: false,
      product: {
        id: 'p1',
        title: 'Women Solids Tank top',
        price: 349,
        compareAtPrice: 1199,
        discountPercent: 71,
        image: '/images/1792739016099-0orsgt.jpg'
      },
      poster: '/images/1792739016099-0orsgt.jpg'
    },
    {
      id: 'r2',
      title: 'College Ready Streetwear',
      creator: '@urban_fits',
      likes: 852,
      shares: 41,
      liked: false,
      product: {
        id: 'p2',
        title: 'Men Solids Polo T-Shirt',
        price: 205,
        compareAtPrice: 1399,
        discountPercent: 85,
        image: '/images/1788955741707-46ope6.jpg'
      },
      poster: '/images/1788955741707-46ope6.jpg'
    },
    {
      id: 'r3',
      title: 'Winter Warmth Fleece',
      creator: '@nordic_vibes',
      likes: 2410,
      shares: 130,
      liked: false,
      product: {
        id: 'p3',
        title: 'Men Solids Sweatshirt Bottle Green',
        price: 599,
        compareAtPrice: 1999,
        discountPercent: 70,
        image: '/images/1788955958023-s4pjt1.jpg'
      },
      poster: '/images/1788955958023-s4pjt1.jpg'
    }
  ];

  let activeIndex = 0;
  let isMuted = true;
  let addedFeedback = false;

  function toggleLike(index) {
    reels[index].liked = !reels[index].liked;
    reels[index].likes += reels[index].liked ? 1 : -1;
    reels = [...reels];
  }

  function handleBuyNow(product) {
    addToCart(product);
    goto('/cart');
  }

  function handleAddToCart(product) {
    addToCart(product);
    addedFeedback = true;
    setTimeout(() => addedFeedback = false, 1200);
  }
</script>

<div class="relative w-full h-screen bg-black overflow-hidden flex flex-col justify-between">
  <!-- Top Bar -->
  <div class="absolute top-0 left-0 right-0 z-40 p-4 flex items-center justify-between text-white bg-gradient-to-b from-black/70 to-transparent">
    <a href="/" class="p-2 rounded-full bg-black/40 backdrop-blur-xs hover:bg-black/60 transition" aria-label="Back to Home">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </a>
    <span class="text-sm font-black tracking-widest uppercase">TRENDS</span>
    <button 
      on:click={() => isMuted = !isMuted} 
      class="p-2 rounded-full bg-black/40 backdrop-blur-xs hover:bg-black/60 transition"
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
    >
      {#if isMuted}
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      {:else}
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      {/if}
    </button>
  </div>

  <!-- Reel Slide Display -->
  <div class="relative w-full h-full flex items-center justify-center bg-neutral-900">
    {#each reels as reel, idx}
      {#if idx === activeIndex}
        <div class="relative w-full h-full flex items-center justify-center">
          <img 
            src={reel.poster} 
            alt={reel.title} 
            class="w-full h-full object-cover filter brightness-95" 
            on:error={(e) => { e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'; }}
          />

          <!-- Overlay gradient -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 pointer-events-none"></div>

          <!-- Right Floating Action Buttons -->
          <div class="absolute right-4 bottom-28 z-30 flex flex-col items-center gap-5">
            <!-- Like Button -->
            <button 
              on:click={() => toggleLike(idx)} 
              class="flex flex-col items-center gap-1 text-white hover:scale-110 active:scale-95 transition"
            >
              <div class="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center {reel.liked ? 'text-rose-500' : 'text-white'}">
                <svg class="w-6 h-6" fill={reel.liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span class="text-[11px] font-bold">{reel.likes}</span>
            </button>

            <!-- Share Button -->
            <button 
              on:click={() => { navigator.clipboard?.writeText(window.location.href); alert('Reel link copied!'); }} 
              class="flex flex-col items-center gap-1 text-white hover:scale-110 active:scale-95 transition"
            >
              <div class="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <span class="text-[11px] font-bold">{reel.shares}</span>
            </button>
          </div>

          <!-- Bottom Product Overlay Card -->
          <div class="absolute left-4 right-4 bottom-6 z-30 flex flex-col gap-3">
            <div>
              <span class="text-xs font-bold text-rose-300">{reel.creator}</span>
              <h3 class="text-sm font-bold text-white mt-0.5">{reel.title}</h3>
            </div>

            <!-- Product Pill -->
            <div class="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5 overflow-hidden">
                <img src={reel.product.image} alt={reel.product.title} class="w-10 h-10 rounded-lg object-cover shrink-0" />
                <div class="min-w-0">
                  <h4 class="text-xs font-bold text-white truncate">{reel.product.title}</h4>
                  <div class="flex items-baseline gap-1.5 mt-0.5">
                    <span class="text-xs font-black text-rose-400">₹{reel.product.price}</span>
                    <span class="text-[10px] text-gray-400 line-through">₹{reel.product.compareAtPrice}</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2 shrink-0">
                <button 
                  on:click={() => handleAddToCart(reel.product)}
                  class="px-3 py-1.5 rounded-md bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition active:scale-95"
                >
                  {#if addedFeedback}
                    Added!
                  {:else}
                    + Cart
                  {/if}
                </button>
                <button 
                  on:click={() => handleBuyNow(reel.product)}
                  class="px-3 py-1.5 rounded-md bg-[#A70F2F] text-white text-xs font-bold hover:bg-[#8F0D28] transition active:scale-95 shadow-md"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      {/if}
    {/each}
  </div>

  <!-- Vertical Switcher Indicators -->
  <div class="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5">
    {#each reels as _, idx}
      <button 
        on:click={() => activeIndex = idx}
        class="w-1.5 rounded-full transition-all {idx === activeIndex ? 'h-6 bg-white' : 'h-1.5 bg-white/40'}"
        aria-label={"View reel " + (idx + 1)}
      ></button>
    {/each}
  </div>
</div>

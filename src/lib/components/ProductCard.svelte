<script>
  import { addToCart } from '$lib/stores/cart.js';

  let { product } = $props();
  let added = $state(false);

  function handleAdd(e) {
    e.stopPropagation();
    addToCart(product);
    added = true;
    setTimeout(() => {
      added = false;
    }, 1200);
  }
</script>

<article class="w-full shrink-0 cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0">
  <div class="relative overflow-hidden rounded-bl-[4px] rounded-br-[16px] rounded-tl-[4px] rounded-tr-[4px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] bg-gray-50 aspect-[3/4]">
    <img 
      alt={product.title} 
      class="h-full w-full object-cover" 
      src={product.image}
      loading="lazy"
      onerror={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'; }}
    />
    
    <button 
      type="button" 
      onclick={handleAdd}
      class="absolute bottom-[0px] right-[0px] z-20 flex size-[28px] items-center justify-center rounded-full bg-white/80 backdrop-blur-[2px] text-[#A92645] transition-all duration-200 hover:scale-105 shadow-[0_2px_18px_rgba(200,200,200,0.40),inset_0_1px_4px_rgba(255,255,255,1)] active:scale-95 cursor-pointer" 
      aria-label="Add {product.title} to cart"
      title="Add to cart"
    >
      {#if added}
        <svg class="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      {:else}
        <img alt="Add to cart" class="h-[13px] w-[13px] object-contain" src="/add-to-cart.svg" />
      {/if}
    </button>
  </div>

  <div class="flex flex-col space-y-1 pt-2">
    <p class="line-clamp-2 text-xs sm:text-sm leading-[1.15] text-[#4A4640]">
      {product.title}
    </p>
    <p class="text-xs sm:text-sm font-semibold text-black">
      ₹{product.price}
      {#if product.compareAtPrice}
        <span class="font-light text-black/50 line-through text-[11px] sm:text-xs">₹{product.compareAtPrice}</span>
      {/if}
      {#if product.discountPercent}
        <span class="font-light text-[11px] sm:text-xs text-[#0CB72E]">{product.discountPercent}% OFF</span>
      {/if}
    </p>
  </div>
</article>
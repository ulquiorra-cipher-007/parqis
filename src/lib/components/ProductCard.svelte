<script>
  import { addToCart } from '$lib/stores/cart.js';

  export let product;
  let added = false;

  function handleAdd(e) {
    e.stopPropagation();
    addToCart(product);
    added = true;
    setTimeout(() => {
      added = false;
    }, 1200);
  }
</script>

<div class="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition group flex flex-col justify-between">
  <!-- Image Container -->
  <div class="relative aspect-[3/4] bg-gray-50 overflow-hidden">
    <img 
      src={product.image} 
      alt={product.title} 
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      loading="lazy"
      on:error={(e) => { e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'; }}
    />
    
    {#if product.discountPercent > 0}
      <span class="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
        {product.discountPercent}% OFF
      </span>
    {/if}

    <button 
      type="button"
      on:click={handleAdd}
      class="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 text-gray-800 shadow-md flex items-center justify-center hover:bg-[#A70F2F] hover:text-white transition active:scale-90"
      title="Add to Cart"
    >
      {#if added}
        <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      {:else}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      {/if}
    </button>
  </div>

  <!-- Content -->
  <div class="p-3 flex flex-col flex-1 justify-between">
    <div>
      <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.category}</span>
      <h3 class="text-xs font-semibold text-gray-900 line-clamp-1 mt-0.5 group-hover:text-[#A70F2F] transition-colors">
        {product.title}
      </h3>
    </div>

    <div class="mt-2 flex items-baseline gap-1.5">
      <span class="text-sm font-bold text-gray-900">₹{product.price}</span>
      {#if product.compareAtPrice}
        <span class="text-[11px] text-gray-400 line-through">₹{product.compareAtPrice}</span>
      {/if}
    </div>
  </div>
</div>

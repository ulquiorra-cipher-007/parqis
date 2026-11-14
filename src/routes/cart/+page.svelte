<script>
  import { cart, updateQuantity, toggleSelect } from '$lib/stores/cart.js';
  import { user } from '$lib/stores/user.js';
  import { goto } from '$app/navigation';

  $: selectedItems = $cart.filter(item => item.selected);
  $: subtotal = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  $: totalSavings = selectedItems.reduce((acc, item) => {
    const orig = item.compareAtPrice || item.price;
    return acc + ((orig - item.price) * item.quantity);
  }, 0);

  function handleProceedToCheckout() {
    if (!$user?.isAuthenticated) {
      // Must authenticate first. Notice the callbackUrl includes cart/address!
      goto('/auth/login?callbackUrl=/cart/address');
    } else {
      goto('/cart/address');
    }
  }
</script>

<div class="flex flex-col w-full min-h-screen bg-gray-50 pb-24">
  <!-- Top Header -->
  <div class="p-4 bg-white border-b border-gray-200 sticky top-0 z-40 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <a href="/" class="text-gray-600 hover:text-black" aria-label="Back to Home">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </a>
      <h1 class="text-lg font-bold text-gray-900">Shopping Cart</h1>
    </div>
    <span class="text-xs font-semibold text-gray-500">{$cart.length} items</span>
  </div>

  <!-- Delivery Address Banner -->
  <div class="bg-rose-50/50 p-4 border-b border-rose-100 flex items-center justify-between">
    <div class="flex items-start gap-2.5">
      <svg class="w-4 h-4 text-[#A70F2F] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      </svg>
      <div>
        <h4 class="text-xs font-bold text-gray-900">
          {$user?.isAuthenticated ? 'Delivering to Home' : 'Add delivery address'}
        </h4>
        <p class="text-[11px] text-gray-500">
          {$user?.isAuthenticated ? 'Rourkela 769008, Odisha' : 'Select an address to see delivery options.'}
        </p>
      </div>
    </div>
    <button on:click={handleProceedToCheckout} class="text-xs font-bold text-[#A70F2F] hover:underline">
      Change &gt;
    </button>
  </div>

  {#if $cart.length === 0}
    <!-- Empty Cart -->
    <div class="flex-1 flex flex-col items-center justify-center p-8 text-center mt-12">
      <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 class="text-base font-bold text-gray-800">Your cart is empty</h3>
      <p class="text-xs text-gray-500 mt-1 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
      <a href="/" class="mt-6 px-6 py-2.5 rounded-sm bg-[#A70F2F] text-white text-xs font-bold shadow-xs hover:bg-[#8F0D28] transition">
        Explore Products
      </a>
    </div>
  {:else}
    <!-- Cart Items List -->
    <div class="p-4 space-y-3">
      {#each $cart as item (item.id + item.size)}
        <div class="bg-white rounded-lg p-3.5 border border-gray-200 shadow-xs flex gap-3 relative">
          <!-- Selection Checkbox -->
          <button 
            type="button"
            on:click={() => toggleSelect(item.id, item.size)}
            class="self-center w-5 h-5 rounded border flex items-center justify-center transition {item.selected ? 'bg-[#A70F2F] border-[#A70F2F] text-white' : 'border-gray-300 bg-white'}"
          >
            {#if item.selected}
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            {/if}
          </button>

          <!-- Product Image -->
          <div class="w-20 h-24 bg-gray-100 rounded overflow-hidden shrink-0">
            <img 
              src={item.image} 
              alt={item.title} 
              class="w-full h-full object-cover" 
              on:error={(e) => { e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'; }}
            />
          </div>

          <!-- Product Info & Quantity Controls -->
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <h3 class="text-xs font-bold text-gray-900 line-clamp-1">{item.title}</h3>
              <p class="text-[11px] text-gray-500 mt-0.5">Size: <strong class="text-black">{item.size}</strong> · Color: {item.color}</p>
              
              <div class="flex items-baseline gap-2 mt-1.5">
                <span class="text-sm font-bold text-gray-900">₹{item.price}</span>
                {#if item.compareAtPrice}
                  <span class="text-[11px] text-gray-400 line-through">₹{item.compareAtPrice}</span>
                  <span class="text-[10px] text-emerald-600 font-bold">{item.discountPercent}% OFF</span>
                {/if}
              </div>
            </div>

            <!-- Quantity Counter -->
            <div class="flex items-center gap-3 mt-2">
              <div class="flex items-center border border-gray-200 rounded-sm">
                <button 
                  on:click={() => updateQuantity(item.id, item.size, -1)}
                  class="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-90"
                >
                  −
                </button>
                <span class="w-8 text-center text-xs font-bold">{item.quantity}</span>
                <button 
                  on:click={() => updateQuantity(item.id, item.size, 1)}
                  class="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-90"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Order Summary Card -->
    <div class="p-4 pt-0">
      <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-xs space-y-2.5">
        <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Order Summary</h3>

        <div class="flex justify-between text-xs text-gray-600">
          <span>Items ({selectedItems.length})</span>
          <span class="font-semibold text-gray-900">₹{subtotal}</span>
        </div>

        <div class="flex justify-between text-xs text-gray-600">
          <span>Delivery</span>
          <span class="font-semibold text-emerald-600">FREE</span>
        </div>

        {#if totalSavings > 0}
          <div class="flex justify-between text-xs text-emerald-600 font-semibold">
            <span>Total Savings</span>
            <span>- ₹{totalSavings}</span>
          </div>
        {/if}

        <div class="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-100 pt-2">
          <span>Total To Pay</span>
          <span class="text-base text-[#A70F2F]">₹{subtotal}</span>
        </div>
      </div>
    </div>

    <!-- Fixed Bottom Checkout Bar -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
      <div class="max-w-[480px] lg:max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div>
          <span class="text-[10px] text-gray-500 uppercase font-semibold">To Pay</span>
          <div class="text-lg font-black text-[#A70F2F]">₹{subtotal}</div>
        </div>

        <button 
          type="button"
          disabled={selectedItems.length === 0}
          on:click={handleProceedToCheckout}
          class="flex-1 max-w-xs h-11 rounded-sm bg-[#A70F2F] text-white font-bold text-sm shadow-md hover:bg-[#8F0D28] transition active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span>Proceed to Payment</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  {/if}
</div>

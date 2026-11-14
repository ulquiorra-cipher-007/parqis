<script>
  import { user } from '$lib/stores/user.js';
  import { cart, clearCart } from '$lib/stores/cart.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  // Guard: User must be authenticated to access this page
  onMount(() => {
    if (!$user?.isAuthenticated) {
      goto('/auth/login?callbackUrl=/cart/address');
    }
  });

  let receiverName = $user?.fullName || '';
  let phone = $user?.phone || '';
  let streetColony = 'Sector 2, NIT Rourkela Campus';
  let apartmentNo = 'Hall 7, Room B-204';
  let landmark = 'Near Central Library';
  let city = 'Rourkela';
  let postalCode = '769008';
  let paymentMethod = 'upi'; // 'upi' | 'cod'

  let orderPlaced = false;
  let orderId = '';
  let isPlacing = false;

  $: selectedItems = $cart.filter(i => i.selected);
  $: subtotal = selectedItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  async function handlePlaceOrder() {
    isPlacing = true;
    await new Promise(r => setTimeout(r, 1000));
    orderId = 'PQ-' + Math.floor(100000 + Math.random() * 900000);
    orderPlaced = true;
    isPlacing = false;
    clearCart();
  }
</script>

<div class="flex flex-col w-full min-h-screen bg-white pb-16">
  <!-- Top Header -->
  <div class="p-4 bg-white border-b border-gray-200 sticky top-0 z-40 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <a href="/cart" class="text-gray-600 hover:text-black" aria-label="Back to Cart">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </a>
      <h1 class="text-lg font-bold text-gray-900">Delivery Address &amp; Payment</h1>
    </div>
  </div>

  <div class="p-4 max-w-lg mx-auto w-full space-y-6">
    <!-- User Phone Badge -->
    <div class="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-md">
      <div class="flex items-center gap-2 text-xs font-semibold text-emerald-800">
        <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span>Verified Mobile: +91 {phone || '9876543210'}</span>
      </div>
      <span class="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">Verified</span>
    </div>

    <!-- Address Form -->
    <div class="space-y-3.5">
      <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Shipping Details</h2>

      <div>
        <label for="receiver-name" class="text-xs font-semibold text-gray-600">Receiver Name</label>
        <input 
          id="receiver-name"
          type="text" 
          bind:value={receiverName}
          placeholder="Receiver Name" 
          class="w-full mt-1 h-10 px-3 border border-gray-300 rounded text-xs focus:border-[#A70F2F] outline-none" 
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="apartment-no" class="text-xs font-semibold text-gray-600">Apartment / Flat</label>
          <input 
            id="apartment-no"
            type="text" 
            bind:value={apartmentNo}
            placeholder="Enter apartment no" 
            class="w-full mt-1 h-10 px-3 border border-gray-300 rounded text-xs focus:border-[#A70F2F] outline-none" 
          />
        </div>
        <div>
          <label for="postal-code" class="text-xs font-semibold text-gray-600">Postal Code</label>
          <input 
            id="postal-code"
            type="text" 
            bind:value={postalCode}
            placeholder="Postal code" 
            class="w-full mt-1 h-10 px-3 border border-gray-300 rounded text-xs focus:border-[#A70F2F] outline-none" 
          />
        </div>
      </div>

      <div>
        <label for="street-colony" class="text-xs font-semibold text-gray-600">Street / Colony</label>
        <input 
          id="street-colony"
          type="text" 
          bind:value={streetColony}
          placeholder="Search Street, Colony...." 
          class="w-full mt-1 h-10 px-3 border border-gray-300 rounded text-xs focus:border-[#A70F2F] outline-none" 
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="city-name" class="text-xs font-semibold text-gray-600">City</label>
          <input 
            id="city-name"
            type="text" 
            bind:value={city}
            placeholder="City name" 
            class="w-full mt-1 h-10 px-3 border border-gray-300 rounded text-xs focus:border-[#A70F2F] outline-none" 
          />
        </div>
        <div>
          <label for="landmark-name" class="text-xs font-semibold text-gray-600">Landmark</label>
          <input 
            id="landmark-name"
            type="text" 
            bind:value={landmark}
            placeholder="Enter Landmark" 
            class="w-full mt-1 h-10 px-3 border border-gray-300 rounded text-xs focus:border-[#A70F2F] outline-none" 
          />
        </div>
      </div>
    </div>

    <!-- Payment Option -->
    <div class="space-y-3 pt-2">
      <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Payment Method</h2>
      
      <label class="flex items-center gap-3 p-3.5 border rounded-lg cursor-pointer transition {paymentMethod === 'upi' ? 'border-[#A70F2F] bg-rose-50/20' : 'border-gray-200'}">
        <input type="radio" bind:group={paymentMethod} value="upi" class="accent-[#A70F2F]" />
        <div class="flex-1">
          <span class="text-xs font-bold text-gray-900 block">UPI / Razorpay (Instant Checkout)</span>
          <span class="text-[11px] text-gray-500">Google Pay, PhonePe, Paytm or Card</span>
        </div>
      </label>

      <label class="flex items-center gap-3 p-3.5 border rounded-lg cursor-pointer transition {paymentMethod === 'cod' ? 'border-[#A70F2F] bg-rose-50/20' : 'border-gray-200'}">
        <input type="radio" bind:group={paymentMethod} value="cod" class="accent-[#A70F2F]" />
        <div class="flex-1">
          <span class="text-xs font-bold text-gray-900 block">Cash on Delivery</span>
          <span class="text-[11px] text-gray-500">Pay cash or scan QR at doorstep</span>
        </div>
      </label>
    </div>

    <!-- Amount & CTA -->
    <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
      <div>
        <span class="text-[10px] text-gray-500 uppercase font-bold">Total Payable</span>
        <div class="text-xl font-black text-[#A70F2F]">₹{subtotal}</div>
      </div>

      <button 
        type="button"
        disabled={isPlacing || subtotal === 0}
        on:click={handlePlaceOrder}
        class="h-11 px-8 rounded-sm bg-[#A70F2F] text-white font-bold text-sm shadow-md hover:bg-[#8F0D28] transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
      >
        {#if isPlacing}
          <span class="animate-spin">⏳</span>
          <span>Processing...</span>
        {:else}
          <span>Place Order</span>
          <span>&rarr;</span>
        {/if}
      </button>
    </div>
  </div>
</div>

<!-- ============================================= -->
<!-- ORDER CONFIRMATION MODAL                      -->
<!-- ============================================= -->
{#if orderPlaced}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
    <div class="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl flex flex-col items-center">
      <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-black mb-4">
        ✓
      </div>
      <h3 class="text-lg font-black text-gray-900">Order Confirmed!</h3>
      <p class="text-xs text-gray-600 mt-1">Thank you for shopping with PARQIS.</p>
      
      <div class="my-4 py-2 px-4 bg-gray-50 rounded border border-gray-100 text-xs font-mono font-bold text-gray-800">
        Order ID: {orderId}
      </div>

      <p class="text-[11px] text-gray-500">Delivering to {apartmentNo}, {city} within 2-4 business days.</p>

      <a 
        href="/" 
        class="mt-6 w-full py-2.5 rounded bg-[#A70F2F] text-white text-xs font-bold hover:bg-[#8F0D28] transition"
      >
        Back to Home
      </a>
    </div>
  </div>
{/if}

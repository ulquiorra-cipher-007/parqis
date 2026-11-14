<script>
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { loginWithPhone, user } from '$lib/stores/user.js';

  // Read callback URL query parameter
  let callbackUrl = $derived(page.url.searchParams.get('callbackUrl') || '');
  
  // Strict check: Is this part of the checkout / payment pipeline?
  let isCheckoutFlow = $derived(
    callbackUrl.includes('cart') || 
    callbackUrl.includes('address') || 
    callbackUrl.includes('payment') || 
    callbackUrl.includes('checkout')
  );

  let phone = $state('');
  let step = $state('phone'); // 'phone' | 'otp'
  let otpDigits = $state(['', '', '', '', '', '']);
  let generatedOtp = $state('');
  let showAutoFillPrompt = $state(false);
  let isAutoTyping = $state(false);
  let isVerifying = $state(false);
  let errorMessage = $state('');

  // Triggered when user enters 10-digit number
  function handleContinue() {
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      errorMessage = 'Please enter a valid 10-digit mobile number';
      return;
    }
    errorMessage = '';
    
    // Generate realistic 6-digit dummy OTP
    generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    step = 'otp';

    // Simulate mobile SMS notification and OS Auto-fill popup after 1 second
    setTimeout(() => {
      showAutoFillPrompt = true;
    }, 1100);
  }

  // Simulated Mobile OS / WebOTP Auto-fill action
  async function handleAutoFill() {
    showAutoFillPrompt = false;
    isAutoTyping = true;

    // Simulate animated digit-by-digit auto typing into the 6 boxes
    for (let i = 0; i < 6; i++) {
      await new Promise(res => setTimeout(res, 120));
      otpDigits[i] = generatedOtp[i];
    }

    isAutoTyping = false;
    isVerifying = true;

    // Wait a brief moment for verification feedback, then route
    await new Promise(res => setTimeout(res, 500));
    proceedLogin();
  }

  function handleManualInput(e, index) {
    const val = e.target.value.replace(/\D/g, '');
    otpDigits[index] = val ? val[val.length - 1] : '';

    // Auto-focus next input box
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    if (otpDigits.every(d => d !== '')) {
      proceedLogin();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-box-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  }

  function proceedLogin() {
    // Authenticate user in store and localStorage
    loginWithPhone(phone);

    // If coming from checkout/cart, navigate immediately to the destination
    if (callbackUrl) {
      goto(callbackUrl);
    } else {
      goto('/');
    }
  }
</script>

<div class="flex min-h-screen w-full flex-col bg-white">
  <!-- Top Onboarding Visual -->
  <div class="w-full aspect-[340/190] bg-[#f5b0c2]/20 overflow-hidden shrink-0 flex flex-col items-center justify-center relative">
    <div class="w-16 h-16 rounded-2xl bg-[#A70F2F] text-white flex items-center justify-center shadow-lg mb-2">
      <span class="text-3xl font-black">P</span>
    </div>
    <span class="text-sm font-bold tracking-widest text-rose-950 uppercase">PARQIS SOCIAL COMMERCE</span>
  </div>

  <div class="px-6 mt-6 flex-1 flex flex-col justify-between pb-8">
    <div>
      {#if step === 'phone'}
        <!-- PHONE STEP -->
        <div class="flex flex-col pb-4">
          <h2 class="text-xl font-bold tracking-tight text-left leading-snug">
            <span class="text-black">Your</span> 
            <span class="text-[#00416A]">Coolest</span> 
            <span class="text-[#444444]">Finds</span> 
            <span class="text-[#DC143C]">ahead!</span>
          </h2>
          <p class="text-xs text-gray-500 mt-1">
            {#if isCheckoutFlow}
              <span class="font-semibold text-rose-700">Please verify your mobile number to proceed with order delivery.</span>
            {:else}
              Enter your mobile number to log in or create your account.
            {/if}
          </p>

          <!-- Input Box -->
          <div class="mt-6 flex h-12 items-center overflow-hidden rounded-sm border border-black/20 focus-within:border-black/60 transition-colors">
            <div class="flex items-center pl-3.5 text-base font-bold text-black">+91</div>
            <input 
              type="tel"
              maxlength="10"
              bind:value={phone}
              placeholder="Enter Mobile Number" 
              class="flex-1 bg-transparent px-3 text-base font-bold text-black outline-none placeholder:text-black/40 placeholder:font-normal"
            />
          </div>

          {#if errorMessage}
            <p class="text-red-500 text-xs mt-2 font-medium">{errorMessage}</p>
          {/if}
        </div>

        <button 
          type="button" 
          disabled={phone.trim().length !== 10}
          onclick={handleContinue}
          class="h-11 w-full rounded-sm font-medium text-base transition-all duration-200 flex items-center justify-center shadow-xs {phone.trim().length === 10 ? 'bg-[#A70F2F] text-white hover:bg-[#8F0D28] cursor-pointer' : 'bg-[#E5E7EB] text-black/40 cursor-not-allowed'}"
        >
          Continue
        </button>

        <div class="mt-6 text-center">
          <p class="text-xs font-medium text-black/70">By continuing you agree to our</p>
          <p class="mt-0.5 text-xs font-medium text-black">
            <span class="text-rose-600 underline cursor-pointer">Privacy Policy</span> and 
            <span class="text-rose-600 underline cursor-pointer">Terms of Use</span>
          </p>
        </div>

      {:else}
        <!-- OTP STEP -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold tracking-tight text-black">Verify OTP</h2>
            <button 
              type="button" 
              onclick={() => { step = 'phone'; errorMessage = ''; }}
              class="text-xs text-rose-600 font-semibold underline"
            >
              Change +91 {phone}
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-1">We sent a 6-digit code to your phone number</p>

          <!-- 6-Digit OTP Boxes -->
          <div class="mt-8 flex justify-between gap-2 max-w-sm mx-auto w-full">
            {#each otpDigits as digit, i}
              <input 
                id="otp-box-{i}"
                type="text" 
                inputmode="numeric"
                maxlength="1"
                value={digit}
                oninput={(e) => handleManualInput(e, i)}
                onkeydown={(e) => handleKeyDown(e, i)}
                class="w-12 h-14 text-center text-xl font-black rounded border border-gray-300 focus:border-[#A70F2F] focus:ring-1 focus:ring-[#A70F2F] outline-none transition bg-neutral-50 {digit ? 'border-[#A70F2F] bg-rose-50/30' : ''}"
              />
            {/each}
          </div>

          {#if isAutoTyping}
            <p class="text-center text-xs text-blue-600 font-medium mt-4 animate-pulse">
              Filling code from SMS...
            </p>
          {:else if isVerifying}
            <div class="flex items-center justify-center gap-2 mt-4 text-emerald-600 text-xs font-semibold">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Verifying OTP...</span>
            </div>
          {/if}

          <!-- Verification CTA -->
          <button 
            type="button" 
            onclick={proceedLogin}
            class="mt-8 h-11 w-full rounded-sm bg-[#A70F2F] text-white font-medium hover:bg-[#8F0D28] transition shadow-xs flex items-center justify-center"
          >
            Verify &amp; Proceed
          </button>

          <!-- Resend Dummy Code -->
          <button 
            type="button"
            onclick={() => { 
              generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
              showAutoFillPrompt = true; 
            }}
            class="text-xs text-gray-500 hover:text-black font-medium mt-4 text-center cursor-pointer"
          >
            Didn't receive code? <span class="text-rose-600 font-semibold underline">Resend SMS</span>
          </button>
        </div>
      {/if}
    </div>

    <!-- BOTTOM ACTIONS: Skip Button Logic -->
    <div class="space-y-4 pt-6">
      <div class="flex justify-end">
        {#if !isCheckoutFlow}
          <!-- In normal browsing, Skip is allowed -->
          <button 
            type="button" 
            onclick={() => goto('/')}
            class="text-base font-medium text-black/60 transition-colors hover:text-black cursor-pointer"
          >
            Skip
          </button>
        {:else}
          <!-- IN CHECKOUT/PAYMENT FLOW: STRICTLY REMOVED SKIP! -->
          <div class="w-full text-center py-2 px-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 font-medium">
            🔒 Account verification required to proceed to payment &amp; delivery
          </div>
        {/if}
      </div>

      <p class="text-center text-[10px] font-medium leading-4 text-[#666666]">
        We use your on-platform behavior to personalize the Parqis experience for you. You can turn it off in Account settings.
      </p>
    </div>
  </div>
</div>

<!-- ========================================================================= -->
<!-- SIMULATED MOBILE OS / GOOGLE SMS RETRIEVER AUTO-FILL PERMISSION MODAL     -->
<!-- ========================================================================= -->
{#if showAutoFillPrompt}
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
    <div class="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-gray-100 flex flex-col gap-3 transform transition-all animate-slideUp">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
          </svg>
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-gray-900">Auto-fill verification code</h4>
            <span class="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">Messages</span>
          </div>
          <p class="text-xs text-gray-600 mt-1 leading-snug">
            Parqis wants to autofill your 6-digit OTP: <span class="font-mono font-bold text-gray-900 text-sm tracking-wider">{generatedOtp}</span>
          </p>
        </div>
      </div>

      <div class="mt-2 flex gap-2">
        <button 
          type="button"
          onclick={() => showAutoFillPrompt = false}
          class="flex-1 py-2.5 text-xs font-semibold text-gray-600 rounded-lg bg-gray-100 hover:bg-gray-200 transition active:scale-95 cursor-pointer"
        >
          Cancel
        </button>
        <button 
          type="button"
          onclick={handleAutoFill}
          class="flex-1 py-2.5 text-xs font-bold text-white rounded-lg bg-blue-600 hover:bg-blue-700 shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Allow Auto-fill</span>
          <span class="font-mono text-blue-200 text-[11px]">({generatedOtp})</span>
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out forwards;
  }
  .animate-slideUp {
    animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
</style>

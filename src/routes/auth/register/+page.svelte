<script>
  import { goto } from '$app/navigation';
  import { user, updateProfile } from '$lib/stores/user.js';
  import { page } from '$app/state';

  let fullName = '';
  let email = '';
  let username = '';
  let dob = '';
  let gender = '';
  let errorMessage = '';

  let callbackUrl = $derived(page.url.searchParams.get('callbackUrl') || '/');

  function handleSubmit() {
    if (!fullName.trim()) {
      errorMessage = 'Please enter your full name';
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      errorMessage = 'Please enter a valid email address';
      return;
    }
    if (!username.trim() || username.length < 3) {
      errorMessage = 'Username must be at least 3 characters';
      return;
    }

    updateProfile({
      fullName,
      email,
      username,
      dob,
      gender
    });

    goto(callbackUrl);
  }
</script>

<main class="flex min-h-screen w-full flex-col bg-white">
  <div class="flex w-full flex-1 flex-col items-center bg-white px-6 pt-12 pb-8 max-w-md mx-auto">
    <div class="flex w-full flex-col">
      <h1 class="text-left text-2xl font-bold leading-tight text-black">Sign Up to get started!</h1>
      <p class="text-xs text-gray-500 mt-1">Complete your Parqis profile</p>

      <form on:submit|preventDefault={handleSubmit} class="mt-8 flex flex-col gap-5">
        <!-- Full Name -->
        <div class="h-11 w-full rounded-sm border px-3.5 flex items-center bg-white transition-colors border-gray-300 focus-within:border-[#A70F2F]">
          <input 
            type="text"
            bind:value={fullName}
            placeholder="Full Name" 
            class="w-full bg-transparent text-sm font-medium outline-none text-black placeholder:text-gray-400" 
          />
        </div>

        <!-- Email -->
        <div class="h-11 w-full rounded-sm border px-3.5 flex items-center bg-white transition-colors border-gray-300 focus-within:border-[#A70F2F]">
          <input 
            type="email"
            bind:value={email}
            placeholder="E-mail address" 
            class="w-full bg-transparent text-sm font-medium outline-none text-black placeholder:text-gray-400" 
          />
        </div>

        <!-- Username -->
        <div>
          <div class="h-11 w-full rounded-sm border px-3.5 flex items-center bg-white transition-colors border-gray-300 focus-within:border-[#A70F2F]">
            <input 
              type="text"
              maxlength="30"
              bind:value={username}
              placeholder="Username" 
              class="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none text-black placeholder:text-gray-400" 
            />
            <span class="shrink-0 text-[10px] text-gray-400">@parqis</span>
          </div>
          <p class="mt-1 text-[10px] text-gray-500">3–30 lowercase letters, numbers, or underscores</p>
        </div>

        <!-- Date of Birth -->
        <div class="h-11 w-full rounded-sm border px-3.5 flex items-center bg-white transition-colors border-gray-300 focus-within:border-[#A70F2F]">
          <input 
            type="date"
            bind:value={dob}
            placeholder="Date of Birth" 
            class="w-full bg-transparent text-sm font-medium outline-none text-black" 
          />
        </div>

        <!-- Gender -->
        <div class="h-11 w-full rounded-sm border px-3.5 flex items-center bg-white transition-colors border-gray-300 focus-within:border-[#A70F2F]">
          <select 
            bind:value={gender}
            class="w-full bg-transparent text-sm font-medium outline-none cursor-pointer text-black"
          >
            <option value="" disabled selected>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Prefer not to say</option>
          </select>
        </div>

        {#if errorMessage}
          <p class="text-xs text-red-500 font-medium">{errorMessage}</p>
        {/if}

        <button 
          type="submit" 
          class="mt-4 flex h-11 w-full cursor-pointer items-center justify-center rounded-sm bg-[#A70F2F] text-base font-medium text-white shadow-xs transition hover:bg-[#8F0D28] active:scale-[0.99]"
        >
          Complete Registration
        </button>
      </form>
    </div>
  </div>
</main>

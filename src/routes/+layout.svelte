<script>
  import '../app.css';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import DesktopHeader from '$lib/components/DesktopHeader.svelte';
  import { page } from '$app/state';

  let { children } = $props();
</script>

<div class="min-h-screen bg-neutral-100 flex flex-col items-center">
  <!-- Desktop Header (Visible on Desktop / PC screens) -->
  {#if !page.url.pathname.startsWith('/trends')}
    <header class="hidden lg:block w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <DesktopHeader />
    </header>
  {/if}

  <!-- Main Responsive Container -->
  <!-- On mobile: max-w-[480px] smartphone container. On desktop: max-w-7xl wide modern UI -->
  <main class="w-full {page.url.pathname.startsWith('/trends') ? 'max-w-[480px]' : 'max-w-[480px] lg:max-w-7xl'} min-h-screen bg-white shadow-xs flex flex-col pb-16 lg:pb-8">
    {@render children()}
  </main>

  <!-- Mobile Bottom Navigation (Visible on Handheld / Mobile devices) -->
  {#if !page.url.pathname.startsWith('/auth')}
    <BottomNav />
  {/if}
</div>
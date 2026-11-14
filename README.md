# PARQIS Social Commerce Web Clone

A high-performance clone of [PARQIS](https://parqis.com/) built with **SvelteKit**, **Tailwind CSS**, and **Supabase**, optimized for single-click deployment to **Vercel**.

---

## 🚀 Key Improvements & Architectural Solutions

### 1. Multi-Folder Architecture vs Single-File Monolith
* Replaced the scraped monolithic HTML dump with standard SvelteKit file-based routing (`src/routes/`).
* Each route is modular, clean, and isolated:
  * `/` : Home shopping feed with categories & banners.
  * `/trends` : Fullscreen social commerce Reels feed (with like, share, mute, and direct "Buy Now" overlays).
  * `/categories` : Filterable category catalog with price sorting.
  * `/cart` : Shopping cart with live item controls, price calculation, and checkout navigation.
  * `/cart/address` : Delivery address & payment method checkout.
  * `/auth/login` : Mobile phone entry and OTP verification.
  * `/auth/register` : User profile registration.
  * `/profile` : Account dashboard.

### 2. Responsive UI (Fixed "Portrait-Only on Desktop" Bug)
* **Handheld Viewport on Mobile:** Bottom navigation bar, thumb-friendly touch targets, sticky bottom action bars.
* **Full Responsive Grid on PC/Desktop:** Elegant desktop top navigation header, multi-column product grids (up to 4 columns), wide layout container (`max-w-7xl`).

### 3. Solved the Faulty Authentication & Skip Loophole
* **Original Bug:** Even during checkout (`callbackUrl=/cart/address`), the original site allowed clicking "Skip", which abandoned the checkout flow and threw the user unauthenticated back to the homepage.
* **The Solution:** In `src/routes/auth/login/+page.svelte`, the route checks `callbackUrl`. If it contains `cart` or `checkout`, the "Skip" button is **completely removed from the DOM** and replaced with an alert badge requiring phone verification before proceeding to payment and address entry.

### 4. Dummy Mobile OTP Feature with Simulated OS Auto-Fillup
* User enters their 10-digit mobile number and clicks **Continue**.
* Transitions to 6 individual OTP input boxes.
* After 1 second, an animated simulated mobile OS / Google Messages popup appears:
  > *"Auto-fill verification code: Parqis wants to autofill your 6-digit OTP (XXXXXX) [Cancel] [Allow Auto-fill]"*
* When the user clicks **Allow Auto-fill**:
  1. A typing animation sequentially fills each of the 6 digits into the boxes with realistic micro-delays.
  2. Displays verification spinner and feedback checkmark.
  3. Saves the authenticated session in the Svelte store and `localStorage`.
  4. Automatically routes the user straight to their destination (`/cart/address` or `/`).

---

## 🛠️ Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🗄️ Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and execute the schema provided in [`supabase_schema.sql`](./supabase_schema.sql).
3. Copy your project URL and anon public key to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## ☁️ Deploying to Vercel

This project is pre-configured with `@sveltejs/adapter-vercel`.

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Environment Variables.
4. Click **Deploy**!

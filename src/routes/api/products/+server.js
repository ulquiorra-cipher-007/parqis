import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabaseAdmin.js';
import fs from 'fs';
import path from 'path';

export async function GET({ url }) {
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('q');

  try {
    // If Supabase is connected, query the DB
    let query = supabaseAdmin.from('products').select('*');
    if (category && category !== 'ALL') {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return json({ source: 'database', products: data });
    }
  } catch (err) {
    // Fall back to local products.json if DB is not configured yet
  }

  // Fallback to static/data/products.json
  try {
    const filePath = path.resolve('static/data/products.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      let products = JSON.parse(raw);
      if (category && category !== 'ALL') {
        products = products.filter(p => p.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        products = products.filter(p => p.title.toLowerCase().includes(q));
      }
      return json({ source: 'local_cache', products });
    }
  } catch (e) {
    return json({ error: 'Failed to read products' }, { status: 500 });
  }

  return json({ products: [] });
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin.from('products').insert([body]).select();
    if (error) {
      return json({ error: error.message }, { status: 400 });
    }
    return json({ success: true, product: data[0] });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
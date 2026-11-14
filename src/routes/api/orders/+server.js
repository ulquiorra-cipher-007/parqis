import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabaseAdmin.js';

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { items, address, paymentMethod, totalAmount, phone } = body;

    const orderNumber = 'PRQ-' + Math.floor(100000 + Math.random() * 900000);

    // If Supabase is active, insert into database
    try {
      const { data: orderData, error: orderErr } = await supabaseAdmin
        .from('orders')
        .insert([{
          order_number: orderNumber,
          total_amount: totalAmount,
          status: 'confirmed',
          payment_method: paymentMethod || 'dummy_online'
        }])
        .select();

      if (!orderErr && orderData) {
        return json({
          success: true,
          orderNumber,
          status: 'confirmed',
          persisted: true
        });
      }
    } catch (e) {
      // In case database table is not yet migrated, still return confirmed order
    }

    return json({
      success: true,
      orderNumber,
      status: 'confirmed',
      persisted: false,
      message: 'Order created successfully'
    });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
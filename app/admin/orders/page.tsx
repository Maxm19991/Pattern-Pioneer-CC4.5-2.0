import { getSupabaseClient } from '@/lib/supabase';
import OrdersTable from '@/components/admin/OrdersTable';

export default async function AdminOrdersPage() {
  const supabase = getSupabaseClient();

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      users (
        email,
        name
      ),
      order_items (
        id,
        pattern_id,
        patterns (
          name
        )
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>
      <OrdersTable orders={orders || []} />
    </div>
  );
}

import { getSupabaseClient } from '@/lib/supabase';
import UsersTable from '@/components/admin/UsersTable';

export default async function AdminUsersPage() {
  const supabase = getSupabaseClient();

  // Fetch all users with their order counts
  const { data: users } = await supabase
    .from('users')
    .select(`
      *,
      orders (
        id,
        total,
        status
      )
    `)
    .order('created_at', { ascending: false });

  // Calculate stats for each user
  const usersWithStats = users?.map((user: any) => {
    const orders = user.orders || [];
    const completedOrders = orders.filter((o: any) => o.status === 'completed');
    const totalSpent = completedOrders.reduce(
      (sum: number, o: any) => sum + parseFloat(o.total),
      0
    );

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      is_admin: user.is_admin,
      created_at: user.created_at,
      orderCount: orders.length,
      completedOrderCount: completedOrders.length,
      totalSpent,
    };
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Users</h1>
      <UsersTable users={usersWithStats || []} />
    </div>
  );
}

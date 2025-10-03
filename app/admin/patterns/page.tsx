import { getSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';
import PatternCard from '@/components/admin/PatternCard';

export const dynamic = 'force-dynamic';

export default async function AdminPatternsPage() {
  const supabase = getSupabaseClient();

  const { data: patterns } = await supabase
    .from('patterns')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Patterns</h1>
        <Link
          href="/admin/patterns/upload"
          className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          + Upload Pattern
        </Link>
      </div>

      {/* Patterns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {patterns?.map((pattern) => (
          <PatternCard key={pattern.id} pattern={pattern} />
        ))}
      </div>

      {!patterns || patterns.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600">No patterns yet</p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PatternCardProps {
  pattern: {
    id: string;
    name: string;
    slug: string;
    image_url: string;
    price: string;
    category: string | null;
  };
}

export default function PatternCard({ pattern }: PatternCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/patterns/delete/${pattern.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete');
      }

      // Refresh the page to show updated list
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Failed to delete pattern');
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={pattern.image_url}
          alt={pattern.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{pattern.name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          €{parseFloat(pattern.price).toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 mb-3">
          {pattern.category || 'Uncategorized'}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/admin/patterns/edit/${pattern.id}`}
            className="flex-1 bg-gray-900 text-white text-center py-2 px-3 rounded text-sm font-medium hover:bg-gray-800 transition"
          >
            Edit
          </Link>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={deleting}
            className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-red-700 transition disabled:bg-gray-400"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Pattern?
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{pattern.name}"? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded font-medium hover:bg-red-700 transition disabled:bg-gray-400"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={deleting}
                  className="flex-1 bg-gray-200 text-gray-900 py-2 px-4 rounded font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

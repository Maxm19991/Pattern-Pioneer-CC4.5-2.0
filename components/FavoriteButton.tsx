'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  patternId: string;
  initialIsFavorited?: boolean;
}

export default function FavoriteButton({ patternId, initialIsFavorited = false }: FavoriteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setIsAnimating(true);

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patternId }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.isFavorited);

        // Reset animation after it completes
        setTimeout(() => setIsAnimating(false), 600);
      } else {
        console.error('Failed to toggle favorite');
        setIsAnimating(false);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setIsAnimating(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`
        group relative p-2 rounded-full transition-all duration-200
        ${isFavorited ? 'bg-red-50 hover:bg-red-100' : 'bg-gray-50 hover:bg-gray-100'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      disabled={isLoading}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className={`
          w-5 h-5 transition-all duration-300
          ${isAnimating ? 'scale-125' : 'scale-100'}
          ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-400 group-hover:text-red-400'}
        `}
        fill={isFavorited ? 'currentColor' : 'none'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>

      {/* Pulse animation on favorite */}
      {isAnimating && isFavorited && (
        <span className="absolute inset-0 rounded-full bg-red-400 opacity-0 animate-ping" />
      )}
    </button>
  );
}

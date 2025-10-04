import Image from "next/image";
import Link from "next/link";
import type { Pattern } from "@/lib/types";
import FavoriteButton from "./FavoriteButton";

interface PatternCardProps {
  pattern: Pattern;
  isOwned?: boolean;
  isFavorited?: boolean;
}

export default function PatternCard({ pattern, isOwned = false, isFavorited = false }: PatternCardProps) {
  return (
    <Link
      href={`/patterns/${pattern.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={pattern.image_url}
          alt={pattern.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />
        {isOwned && (
          <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
            <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            Owned
          </div>
        )}
      </div>
      <div className="p-4 relative">
        <div className="pr-12">
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition">
            {pattern.name}
          </h3>
          <p className="text-primary-600 font-bold">€{pattern.price.toFixed(2)}</p>
        </div>
        <div className="absolute bottom-4 right-4">
          <FavoriteButton patternId={pattern.id} initialIsFavorited={isFavorited} />
        </div>
      </div>
    </Link>
  );
}

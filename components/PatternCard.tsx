import Image from "next/image";
import Link from "next/link";
import type { Pattern } from "@/lib/types";

interface PatternCardProps {
  pattern: Pattern;
}

export default function PatternCard({ pattern }: PatternCardProps) {
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
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition">
          {pattern.name}
        </h3>
        <p className="text-primary-600 font-bold">€{pattern.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}

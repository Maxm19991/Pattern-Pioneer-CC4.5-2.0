import Link from "next/link";
import CartButton from "./CartButton";
import AuthButton from "./AuthButton";

export default function Navigation() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            Pattern Pioneer
          </Link>
          <div className="flex gap-2 sm:gap-4 md:gap-6 items-center">
            <Link href="/patterns" className="text-sm sm:text-base text-gray-700 hover:text-gray-900 hidden sm:inline">
              Patterns
            </Link>
            <Link href="/about" className="text-sm sm:text-base text-gray-700 hover:text-gray-900 hidden sm:inline">
              About
            </Link>
            <CartButton />
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

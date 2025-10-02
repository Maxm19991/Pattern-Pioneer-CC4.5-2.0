import { getPatterns } from "@/lib/data/patterns";
import PatternCard from "@/components/PatternCard";
import Navigation from "@/components/Navigation";

export default async function PatternsPage() {
  const patterns = await getPatterns();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Patterns</h1>
          <p className="text-gray-600">
            {patterns.length} premium patterns available
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {patterns.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </main>
    </div>
  );
}

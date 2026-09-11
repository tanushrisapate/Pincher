import Link from 'next/link';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-6 text-center relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-light/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="glass-card p-12 rounded-3xl max-w-lg w-full flex flex-col items-center">
        <div className="w-20 h-20 bg-accent-honey/20 rounded-full flex items-center justify-center text-accent-honey mb-6">
          <SearchX className="w-10 h-10" />
        </div>
        
        <h2 className="font-heading text-4xl font-bold text-text-primary mb-4">
          Oops, this outfit doesn't exist
        </h2>
        
        <p className="text-text-secondary text-lg mb-8">
          It looks like we couldn't find the page you were looking for. Let's get you back to your closet. 👚
        </p>
        
        <Link 
          href="/" 
          className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

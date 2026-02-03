'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>© {currentYear} WonderText</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart size={14} className="text-red-500 fill-red-500" /> by Harsh Yadav
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-primary text-white py-8 mt-auto">
      <div className="container-app">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-right">
            <h3 className="font-serif text-xl font-semibold">Restaurant</h3>
            <p className="text-primary-400 text-sm mt-1">
              تجربة طعام استثنائية بتقنية الواقع المعزز
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-primary-400">
            <Link href="/menu" className="hover:text-white transition-colors">
              القائمة
            </Link>
            <span className="text-primary-600">|</span>
            <Link href="/order" className="hover:text-white transition-colors">
              طلباتي
            </Link>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-primary-800 text-center text-xs text-primary-500">
          © {new Date().getFullYear()} Restaurant AR Platform. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}

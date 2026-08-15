import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-stone-900 bg-stone-950 text-stone-400 py-16 px-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-3 md:col-span-2">
          <p className="font-serif text-2xl text-white tracking-widest">THEROSEPALLETTE</p>
          <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
            Exploring identity, memory, and the boundary between observer and observed through the "Crows" lens
          </p>
          <p className="text-xs text-stone-500 pt-2">
            {/* TODO: Replace with real studio address and registration details */}
            Studio Gallery, Nairobi, Kenya
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-stone-200 font-semibold mb-3">Navigation</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-amber-200 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-amber-200 transition">
                Gallery & Shop
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-amber-200 transition">
                Artist Statement & Bio
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-amber-200 transition">
                Commissions & Inquiries
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-stone-200 font-semibold mb-3">Connect</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://instagram.com/therosepallette"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-200 transition"
              >
                Instagram (@therosepallette)
              </a>
            </li>
            <li>
              <a href="mailto:rosmainarose@gmail.com" className="hover:text-amber-200 transition">
                rosmainarose@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+254746510835" className="hover:text-amber-200 transition">
                +254 746 510 835
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl mt-12 pt-8 border-t border-stone-900 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-4">
        <p>© {new Date().getFullYear()} THEROSEPALLETTE. All rights reserved.</p>
      </div>
    </footer>
  );
}

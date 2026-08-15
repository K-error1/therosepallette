import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-950/85 backdrop-blur-md border-b border-stone-800/60 transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-serif text-xl font-medium tracking-[0.16em] text-stone-100 group-hover:text-amber-200 transition">
            THEROSEPALLETTE
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-stone-500 border border-stone-800 px-2 py-0.5 rounded">
            Nairobi & Online
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.18em] uppercase text-stone-300 font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `transition duration-200 hover:text-amber-200 py-1 ${
                  isActive ? 'text-white border-b border-amber-300' : 'text-stone-400'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/gallery?filter=available"
            className="flex items-center gap-1.5 border border-stone-700 px-3 py-1.5 text-stone-200 transition hover:border-stone-300 hover:text-white"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Store</span>
          </Link>
        </nav>

        {/* Mobile menu toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-stone-300 hover:text-white p-1.5"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-stone-800 bg-stone-950 px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-4 text-sm tracking-[0.16em] uppercase text-stone-300">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `transition ${isActive ? 'text-amber-300 font-semibold' : 'text-stone-400'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

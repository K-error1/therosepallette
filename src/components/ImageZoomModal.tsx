import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';

interface ImageZoomModalProps {
  imageUrl: string;
  altText: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageZoomModal({ imageUrl, altText, isOpen, onClose }: ImageZoomModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-md cursor-zoom-out overflow-auto"
      >
        <div
          className="relative max-w-6xl max-h-[90vh] flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Controls Bar */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-stone-900/80 p-2 rounded-full border border-stone-700">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 text-stone-300 hover:text-white transition"
              title={isZoomed ? 'Zoom Out' : 'Zoom In'}
            >
              {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-300 hover:text-white transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: isZoomed ? 1.4 : 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={imageUrl}
            alt={altText}
            onClick={() => setIsZoomed(!isZoomed)}
            className={`max-h-[85vh] max-w-full object-contain rounded transition-all duration-300 ${
              isZoomed ? 'cursor-zoom-out scale-125 md:scale-150' : 'cursor-zoom-in'
            }`}
          />

          <p className="mt-4 text-xs text-stone-400 font-light tracking-widest text-center uppercase">
            {altText} — Click image to toggle high-res zoom
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

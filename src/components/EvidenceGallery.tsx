"use client";

import { useState, useEffect } from "react";
import { X, ZoomIn, Download } from "lucide-react";

interface EvidenceGalleryProps {
  images: string[];
}

export function EvidenceGallery({ images }: EvidenceGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Close lightbox on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  if (!images || images.length === 0) return null;

  return (
    <div className="mt-3">
      <span className="text-xs font-semibold text-slate-500 block mb-1.5">
        🖼️ Evidence Photos ({images.length}):
      </span>
      <div className="flex flex-wrap gap-2">
        {images.map((imgUrl, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(imgUrl)}
            type="button"
            className="group relative w-16 h-16 rounded-md overflow-hidden border border-slate-200 hover:border-primary transition-all duration-200 hover:scale-105 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          >
            <img
              src={imgUrl}
              alt={`Evidence ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <ZoomIn className="w-4 h-4 text-white drop-shadow" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          {/* Top Control Bar */}
          <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
            <a
              href={selectedImage}
              download="evidence-photo.png"
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              title="Open / Download Image"
            >
              <Download className="w-5 h-5" />
            </a>
            <button
              onClick={() => setSelectedImage(null)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close lightbox"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Container */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] transition-transform duration-300 transform scale-95 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Evidence Fullscreen"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}

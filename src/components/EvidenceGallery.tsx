"use client";

import { useState, useEffect } from "react";
import { X, ZoomIn, Download } from "lucide-react";

interface EvidenceGalleryProps {
  images: string[] | null | undefined;
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
    <>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
        {images.map((imgUrl, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(imgUrl)}
            type="button"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-500 font-semibold hover:underline cursor-pointer focus:outline-none"
          >
            🖼️ {images.length === 1 ? "1 Image attached" : `Image ${i + 1}`}
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
    </>
  );
}

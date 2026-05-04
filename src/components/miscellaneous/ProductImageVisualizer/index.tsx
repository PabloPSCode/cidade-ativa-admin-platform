import { useEffect, useMemo, useState } from "react";
import { PiArrowLeftBold, PiArrowRightBold } from "react-icons/pi";

type Photo = {
  src: string;
  alt?: string;
  className?: string;
};

export interface ProductImageVisualizerProps {
  images: Photo[];
  className?: string;
  mainImageClassName?: string;
  thumbClassName?: string;
  showHelperText?: boolean;
}

export default function ProductImageVisualizer({
  images,
  className = "",
  mainImageClassName = "",
  thumbClassName = "",
  showHelperText = true,
}: ProductImageVisualizerProps) {
  const safeImages = useMemo(() => images?.filter(Boolean) ?? [], [images]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [origin, setOrigin] = useState<string>("50% 50%");

  useEffect(() => {
    if (currentIndex > safeImages.length - 1) setCurrentIndex(0);
  }, [safeImages, currentIndex]);

  if (!safeImages.length) return null;

  const current = safeImages[currentIndex];

  const goPrev = () =>
    setCurrentIndex((i) => (i === 0 ? safeImages.length - 1 : i - 1));
  const goNext = () =>
    setCurrentIndex((i) => (i === safeImages.length - 1 ? 0 : i + 1));

  const handleMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  };

  return (
    <div
      className={`grid w-full items-start gap-3 bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-gray-100 md:grid-cols-[88px_1fr] ${className}`}
    >
      <div className="order-2 flex gap-2 pr-1 md:order-1 md:h-[420px] md:flex-col md:overflow-y-auto">
        {safeImages.map((img, idx) => {
          const active = idx === currentIndex;
          return (
            <button
              key={`${img.src}-${idx}`}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className="relative shrink-0 overflow-hidden rounded-md"
              aria-label={img.alt ?? `Imagem ${idx + 1}`}
              aria-current={active ? "true" : undefined}
            >
              <img
                src={img.src}
                alt={img.alt ?? `Miniatura ${idx + 1}`}
                loading="lazy"
                width={88}
                height={88}
                className={`h-[88px] w-[88px] object-cover ${
                  active
                    ? "border-2 border-primary"
                    : "hover:brightness-90"
                } ${thumbClassName} ${img.className ?? ""}`}
              />
            </button>
          );
        })}
        <span className="text-xs text-slate-500 dark:text-gray-400">
          {`${currentIndex + 1}/${safeImages.length}`}
        </span>
      </div>

      <div className="order-1 md:order-2">
        <div
          className="relative aspect-square w-full max-w-5xl overflow-hidden bg-slate-200/40 dark:bg-white/5 sm:aspect-[4/3] md:max-h-[50vh]"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") goPrev();
            if (event.key === "ArrowRight") goNext();
          }}
        >
          <button
            type="button"
            onClick={goPrev}
            aria-label="Imagem anterior"
            className="absolute left-2 top-1/2 z-10 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-2 text-slate-800 transition hover:bg-white dark:bg-slate-700/80 dark:text-gray-100 dark:hover:bg-slate-700"
          >
            <PiArrowLeftBold className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Próxima imagem"
            className="absolute right-2 top-1/2 z-10 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-2 text-slate-800 transition hover:bg-white dark:bg-slate-700/80 dark:text-gray-100 dark:hover:bg-slate-700"
          >
            <PiArrowRightBold className="h-5 w-5" />
          </button>

          <div
            className="group relative h-full w-full cursor-zoom-in select-none"
            onMouseMove={handleMove}
          >
            <img
              src={current.src}
              alt={current.alt ?? `Imagem ${currentIndex + 1}`}
              style={{ transformOrigin: origin }}
              className={`absolute inset-0 h-full w-full cursor-zoom-out object-contain transition-transform duration-200 ease-out group-hover:scale-[1.5] ${mainImageClassName}`}
            />
          </div>
        </div>
        {showHelperText && (
          <p className="mt-2 text-xs text-slate-500 dark:text-gray-400">
            Passe o mouse para ampliar • Use as setas ou os botões para navegar.
          </p>
        )}
      </div>
    </div>
  );
}

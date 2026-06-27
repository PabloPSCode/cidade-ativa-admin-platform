import clsx from "clsx";

type Aspect = "16:9" | "4:3" | "1:1" | "21:9";

function aspectToPadding(aspect: Aspect): string {
  const [w, h] = aspect.split(":").map(Number);
  return `${(h / w) * 100}%`;
}

export interface GoogleMapsRenderProps {
  /** Endereço usado para montar a URL de incorporação do mapa. */
  address: string;
  /** Título do iframe para acessibilidade. */
  title?: string;
  /** Proporção do container. */
  aspect?: Aspect;
  /** Raio de borda do container. */
  borderRadius?: number;
  /** Classe extra do container externo. */
  containerClassName?: string;
  /** Altura mínima (segurança para telas estreitas). */
  minHeight?: number;
}

export default function GoogleMapsRender({
  address,
  title = "Mapa da solicitação",
  aspect = "4:3",
  borderRadius = 4,
  containerClassName,
  minHeight = 300,
}: GoogleMapsRenderProps) {
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    address
  )}&output=embed`;

  return (
    <div
      className={clsx("relative w-full overflow-hidden", containerClassName)}
      style={{
        paddingBottom: aspectToPadding(aspect),
        minHeight,
        borderRadius,
      }}
    >
      <iframe
        title={title}
        src={embedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0"
        allowFullScreen
      />
    </div>
  );
}

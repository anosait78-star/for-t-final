const FALLBACK = "/placeholder.svg";

export function PlaceholderImage({
  src,
  alt,
  className,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
}) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src || FALLBACK} alt={alt} className={className} />;
}

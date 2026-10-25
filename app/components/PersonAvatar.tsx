const FALLBACK = "/avatar-placeholder.svg";

export function PersonAvatar({
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

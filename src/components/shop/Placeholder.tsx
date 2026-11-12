interface Props {
  image: { src: string; alt: string; width?: number; height?: number } | null;
  label: string;
  className?: string;
}

/** Ảnh trống -> khung giữ chỗ. Điền `image` trong JSON là tự hiện ảnh thật. */
export default function Placeholder({ image, label, className = '' }: Props) {
  return (
    <div className={`ph ${className}`} role={image ? undefined : 'img'} aria-label={image ? undefined : `Chỗ để ảnh: ${label}`}>
      {image ? <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" /> : <span>Ảnh: {label}</span>}
    </div>
  );
}

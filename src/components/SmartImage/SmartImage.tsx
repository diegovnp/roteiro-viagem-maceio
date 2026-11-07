import { useState } from 'react';
import { photos } from '../../data/photos';
import { PalmIcon, SunIcon } from '../Decor/Decor';
import './SmartImage.css';

interface Props {
  photoId?: string;
  /** Atributo `sizes` do srcset. */
  sizes: string;
  className?: string;
  /** Primeira dobra: carrega imediatamente com prioridade alta. */
  priority?: boolean;
  /** Mostra o crédito da foto sobre a imagem. */
  showCredit?: boolean;
  /** Texto exibido no fallback quando não há foto adequada. */
  fallbackLabel?: string;
}

/**
 * Imagem responsiva (WebP em várias larguras) com dimensões reservadas,
 * cor de fundo enquanto carrega e um fallback ilustrado elegante caso
 * a foto não exista ou falhe ao carregar.
 */
export function SmartImage({ photoId, sizes, className = '', priority, showCredit, fallbackLabel }: Props) {
  const photo = photoId ? photos[photoId] : undefined;
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!photo || failed) {
    return (
      <div className={`smart-img smart-img--fallback ${className}`} role="img" aria-label={fallbackLabel ?? 'Ilustração de praia'}>
        <SunIcon className="smart-img__fb-sun" />
        <PalmIcon className="smart-img__fb-palm" />
        <svg className="smart-img__fb-sea" viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 30c60 18 120-14 200 0s140 18 200 0v50H0z" />
        </svg>
      </div>
    );
  }

  const url = (w: number) =>
    photo.remote
      ? `${photo.remote.base}/${w}px-${photo.remote.file}`
      : `${import.meta.env.BASE_URL}images/${photo.id}-${w}.webp`;
  const srcSet = photo.widths.map((w) => `${url(w)} ${w}w`).join(', ');
  const mid = photo.widths[Math.min(1, photo.widths.length - 1)];
  const largest = photo.widths[photo.widths.length - 1];

  return (
    <figure className={`smart-img ${loaded ? 'is-loaded' : ''} ${className}`} style={{ backgroundColor: photo.color }}>
      <img
        src={url(mid)}
        srcSet={srcSet}
        sizes={sizes}
        alt={photo.alt}
        width={largest}
        height={Math.round(largest / photo.ratio)}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? { fetchpriority: 'high' } : {})}
        style={{ objectPosition: photo.focus ?? 'center' }}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
      {showCredit && (
        <figcaption className="smart-img__credit">
          Foto: {photo.credit.author} · {photo.credit.license}
        </figcaption>
      )}
    </figure>
  );
}

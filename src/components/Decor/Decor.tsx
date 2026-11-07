/**
 * Ilustrações próprias do projeto (SVG inline) com tema de praia.
 * Todas são decorativas: `aria-hidden` e classe `deco` (ocultas no modo leitura).
 */
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

export function SunIcon(props: P) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false" {...props}>
      <g className="sun-rays" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          const x1 = 60 + Math.cos(a) * 38;
          const y1 = 60 + Math.sin(a) * 38;
          const x2 = 60 + Math.cos(a) * (i % 2 ? 50 : 54);
          const y2 = 60 + Math.sin(a) * (i % 2 ? 50 : 54);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      <circle cx="60" cy="60" r="27" fill="currentColor" />
    </svg>
  );
}

export function ShellIcon(props: P) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M32 56c-11 0-22-7-24-20C6 23 17 8 32 8s26 15 24 28c-2 13-13 20-24 20Z"
        fill="currentColor"
        opacity=".9"
      />
      <path
        d="M32 54V12M32 54 18 16M32 54l14-38M32 54 10 28M32 54l22-26"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity=".75"
        fill="none"
      />
      <path d="M24 56h16l-3 5h-10z" fill="currentColor" />
    </svg>
  );
}

export function StarfishIcon(props: P) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M32 4c2.6 0 4 9.5 6 15 6-1 16-3.5 17.5-1.3 1.4 2.2-6.8 8.2-10.5 12.3 3.4 5 8.8 13.2 7 15-1.9 1.7-10.6-3.2-16.3-5.4-3 5.6-6.4 14.4-9 14.4-2.7 0-3.7-9.6-4.7-15.6-6 .6-16.3 1.8-17.3-.6-.9-2.4 7.8-7.3 12.3-10.8C14.8 22 9.4 14 11 12.2c1.7-2 10.6 2.4 16.3 4.4C29.2 10.4 29.4 4 32 4Z"
        fill="currentColor"
      />
      <g fill="#fff" opacity=".6">
        <circle cx="32" cy="30" r="2" />
        <circle cx="32" cy="18" r="1.4" />
        <circle cx="44" cy="25" r="1.4" />
        <circle cx="21" cy="25" r="1.4" />
        <circle cx="39" cy="41" r="1.4" />
        <circle cx="25" cy="41" r="1.4" />
      </g>
    </svg>
  );
}

export function PalmIcon(props: P) {
  return (
    <svg viewBox="0 0 120 160" aria-hidden="true" focusable="false" {...props}>
      <path d="M62 60c-4 30-2 66 6 96h-10c-8-30-9-66-4-96z" fill="currentColor" opacity=".85" />
      <g fill="currentColor">
        <path d="M60 58C46 40 22 36 6 44c18-1 34 6 46 20z" />
        <path d="M60 58C50 34 52 14 66 2c-6 18-4 36 2 54z" />
        <path d="M60 58c14-20 38-26 56-16-20 0-36 6-48 22z" />
        <path d="M60 58c-20-6-40 2-50 20 14-10 30-14 46-10z" />
        <path d="M62 58c20-4 38 6 46 24-12-10-28-14-44-12z" />
      </g>
      <circle cx="58" cy="62" r="5" fill="currentColor" />
      <circle cx="66" cy="63" r="4.5" fill="currentColor" />
    </svg>
  );
}

export function BoatIcon(props: P) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" {...props}>
      <path d="M30 8v34H10z" fill="currentColor" opacity=".9" />
      <path d="M34 14v28h18z" fill="currentColor" opacity=".55" />
      <path d="M6 46h52l-7 10H14z" fill="currentColor" />
      <path d="M30 6h4v40h-4z" fill="currentColor" />
    </svg>
  );
}

export function CompassRose(props: P) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" {...props}>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" opacity=".35" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" opacity=".5" />
      <path d="M50 6 58 50 50 94 42 50z" fill="currentColor" opacity=".25" />
      <path d="M6 50 50 42 94 50 50 58z" fill="currentColor" opacity=".25" />
      <path d="M50 10 57 50H43z" fill="var(--coral-500)" />
      <path d="M50 90 43 50h14z" fill="currentColor" />
      <circle cx="50" cy="50" r="5" fill="#fff" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function Footprints(props: P) {
  return (
    <svg viewBox="0 0 120 40" aria-hidden="true" focusable="false" {...props}>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${i * 30} ${i % 2 ? 4 : 18}) rotate(80 8 8)`} fill="currentColor">
          <ellipse cx="8" cy="10" rx="5" ry="8" />
          <circle cx="4" cy="0" r="1.6" />
          <circle cx="8" cy="-1" r="1.6" />
          <circle cx="12" cy="0" r="1.6" />
        </g>
      ))}
    </svg>
  );
}

/** Ondas em camadas — animadas por CSS (classe `waves`). */
export function Waves({ className = '' }: { className?: string }) {
  const wave = 'M0 40 C 150 70 350 10 600 40 C 850 70 1050 10 1200 40 V 120 H 0 Z';
  return (
    <div className={`waves ${className}`} aria-hidden="true">
      <svg className="waves__layer waves__layer--back" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d={wave} />
        <path d={wave} transform="translate(1200 0)" />
      </svg>
      <svg className="waves__layer waves__layer--mid" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d={wave} />
        <path d={wave} transform="translate(1200 0)" />
      </svg>
      <svg className="waves__layer waves__layer--front" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d={wave} />
        <path d={wave} transform="translate(1200 0)" />
      </svg>
    </div>
  );
}

/** Divisória ondulada estática entre seções. */
export function WaveDivider({ color = 'var(--sand-100)', flip = false }: { color?: string; flip?: boolean }) {
  return (
    <svg
      className="wave-divider"
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <path d="M0 30c120 20 240 30 360 20S600 10 720 14s240 26 360 26 240-20 360-24v44H0z" fill={color} />
    </svg>
  );
}

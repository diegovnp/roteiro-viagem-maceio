import { BookOpen, Heart, ListChecks, Share2, Sparkles } from 'lucide-react';
import { useMotion } from '../../hooks/useMotion';
import './Header.css';

interface Props {
  solid: boolean;
  favoritesCount: number;
  checklistLeft: number;
  onOpenChecklist: () => void;
  onOpenFavorites: () => void;
  onShare: () => void;
}

export function Header({ solid, favoritesCount, checklistLeft, onOpenChecklist, onOpenFavorites, onShare }: Props) {
  const { readingMode, setReadingMode } = useMotion();

  return (
    <header className={`site-header ${solid ? 'is-solid' : ''}`}>
      <div className="site-header__inner">
        <a href="#topo" className="site-header__brand" aria-label="Maceió 2026 — voltar ao início">
          <span className="site-header__logo" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <circle cx="22" cy="10" r="5" fill="var(--sun-400)" />
              <path d="M2 21c4 3 8 3 12 0s8-3 12 0 4 2 4 2v7H2z" fill="var(--turq-500)" />
              <path d="M2 25c4 3 8 3 12 0s8-3 12 0 4 2 4 2v3H2z" fill="var(--ocean-700)" />
            </svg>
          </span>
          <span className="site-header__name">
            Maceió <span>’26</span>
          </span>
        </a>

        <nav className="site-header__links" aria-label="Seções">
          <a href="#resumo">Resumo</a>
          <a href="#roteiro">Roteiro</a>
          <a href="#mapa">Mapa</a>
        </nav>

        <div className="site-header__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={onOpenChecklist}
            aria-label={`Checklist da viagem${checklistLeft ? ` — ${checklistLeft} itens pendentes` : ''}`}
            title="Checklist da viagem"
          >
            <ListChecks size={22} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onOpenFavorites}
            aria-label={`Favoritos${favoritesCount ? ` — ${favoritesCount} marcados` : ''}`}
            title="Favoritos"
          >
            <Heart size={22} aria-hidden="true" />
            {favoritesCount > 0 && <span className="badge-dot" aria-hidden="true">{favoritesCount}</span>}
          </button>
          <button type="button" className="icon-btn" onClick={onShare} aria-label="Compartilhar roteiro" title="Compartilhar">
            <Share2 size={22} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`icon-btn ${readingMode ? 'is-on' : ''}`}
            onClick={() => setReadingMode(!readingMode)}
            aria-pressed={readingMode}
            aria-label="Modo de leitura (reduz animações e decorações)"
            title={readingMode ? 'Desativar modo de leitura' : 'Ativar modo de leitura'}
          >
            {readingMode ? <BookOpen size={22} aria-hidden="true" /> : <Sparkles size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}

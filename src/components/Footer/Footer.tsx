import { ArrowUp, Camera, Info } from 'lucide-react';
import { photos } from '../../data/photos';
import { ShellIcon, WaveDivider } from '../Decor/Decor';
import './Footer.css';

export function Footer() {
  const list = Object.values(photos);
  return (
    <footer className="site-footer">
      <WaveDivider color="var(--ocean-900)" />
      <div className="site-footer__inner">
        <div className="container">
          <section className="notice" aria-labelledby="avisos-titulo">
            <h2 id="avisos-titulo">
              <Info size={22} aria-hidden="true" /> Antes de sair
            </h2>
            <ul>
              <li>
                Os horários e alturas de maré deste roteiro são referências fornecidas pelo viajante — não são dados
                atualizados nem garantidos. Confira a tábua de marés oficial antes de cada passeio.
              </li>
              <li>Confirme com as operadoras os horários dos passeios antes de sair.</li>
              <li>Passeios às piscinas naturais dependem das condições do mar, da maré e da operação local.</li>
              <li>
                O mapa é esquemático: as posições são aproximadas e a linha pontilhada mostra apenas a ordem das visitas.
              </li>
            </ul>
          </section>

          <details className="credits">
            <summary>
              <Camera size={18} aria-hidden="true" /> Créditos das fotos ({list.length})
            </summary>
            <p>
              Fotos do Wikimedia Commons, usadas conforme as respectivas licenças. Clique para ver o arquivo original.
            </p>
            <ul>
              {list.map((p) => (
                <li key={p.id}>
                  <a href={p.credit.source} target="_blank" rel="noopener noreferrer">
                    {p.alt}
                  </a>{' '}
                  — {p.credit.author} ·{' '}
                  {p.credit.licenseUrl ? (
                    <a href={p.credit.licenseUrl} target="_blank" rel="noopener noreferrer license">
                      {p.credit.license}
                    </a>
                  ) : (
                    p.credit.license
                  )}
                </li>
              ))}
            </ul>
          </details>

          <div className="site-footer__bottom">
            <p>
              <ShellIcon className="site-footer__shell" /> Roteiro Maceió · 11 a 18 de novembro de 2026
            </p>
            <a href="#topo" className="btn btn--ghost btn--small">
              <ArrowUp size={16} aria-hidden="true" /> Voltar ao topo
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import './Sheet.css';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Painel modal acessível baseado em <dialog>: "bottom sheet" no celular
 * e painel lateral no desktop. Fecha com Esc, botão ou toque fora.
 */
export function Sheet({ open, onClose, title, icon, children, footer }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add('has-sheet');
    } else if (!open && dialog.open) {
      dialog.close();
    }
    if (!open) document.documentElement.classList.remove('has-sheet');
  }, [open]);

  useEffect(() => () => document.documentElement.classList.remove('has-sheet'), []);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="sheet-title"
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <div className="sheet__panel">
          <div className="sheet__grabber" aria-hidden="true" />
          <header className="sheet__header">
            <h2 id="sheet-title">
              {icon}
              {title}
            </h2>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">
              <X size={22} aria-hidden="true" />
            </button>
          </header>
          <div className="sheet__body">{children}</div>
          {footer && <footer className="sheet__footer">{footer}</footer>}
        </div>
      )}
    </dialog>
  );
}

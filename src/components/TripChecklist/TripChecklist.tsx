import { Check, ListChecks, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { checklistGroups } from '../../data/checklist';
import { Sheet } from '../Sheet/Sheet';
import './TripChecklist.css';

export interface ChecklistState {
  checked: string[];
  custom: { id: string; label: string }[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  state: ChecklistState;
  onChange: (next: ChecklistState) => void;
}

export const totalChecklistItems = (s: ChecklistState) =>
  checklistGroups.reduce((n, g) => n + g.items.length, 0) + s.custom.length;

export function TripChecklist({ open, onClose, state, onChange }: Props) {
  const [text, setText] = useState('');
  const total = totalChecklistItems(state);
  const allIds = [...checklistGroups.flatMap((g) => g.items.map((i) => i.id)), ...state.custom.map((c) => c.id)];
  const done = state.checked.filter((id) => allIds.includes(id)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const toggle = (id: string) =>
    onChange({
      ...state,
      checked: state.checked.includes(id) ? state.checked.filter((x) => x !== id) : [...state.checked, id],
    });

  const add = (e: FormEvent) => {
    e.preventDefault();
    const label = text.trim();
    if (!label) return;
    onChange({ ...state, custom: [...state.custom, { id: `custom-${Date.now()}`, label }] });
    setText('');
  };

  const remove = (id: string) =>
    onChange({ checked: state.checked.filter((x) => x !== id), custom: state.custom.filter((c) => c.id !== id) });

  const renderItem = (item: { id: string; label: string }, removable = false) => {
    const isOn = state.checked.includes(item.id);
    return (
      <li key={item.id} className={`check ${isOn ? 'is-on' : ''}`}>
        <label>
          <input type="checkbox" checked={isOn} onChange={() => toggle(item.id)} />
          <span className="check__box" aria-hidden="true">
            <Check size={16} strokeWidth={3} />
          </span>
          <span className="check__label">{item.label}</span>
        </label>
        {removable && (
          <button type="button" className="icon-btn check__remove" onClick={() => remove(item.id)} aria-label={`Remover "${item.label}"`}>
            <Trash2 size={18} aria-hidden="true" />
          </button>
        )}
      </li>
    );
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Checklist da viagem"
      icon={<ListChecks size={24} aria-hidden="true" />}
      footer={
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={() => onChange({ ...state, checked: [] })}
          disabled={state.checked.length === 0}
        >
          <RotateCcw size={16} aria-hidden="true" /> Desmarcar tudo
        </button>
      }
    >
      <div className="checklist__progress" role="status">
        <div className="checklist__ring" style={{ ['--pct' as string]: pct }} aria-hidden="true">
          <span>{pct}%</span>
        </div>
        <p>
          <strong>
            {done} de {total}
          </strong>{' '}
          itens prontos
          <br />
          <small>Salvo automaticamente neste dispositivo.</small>
        </p>
      </div>

      {checklistGroups.map((g) => (
        <section key={g.id} className="checklist__group" aria-labelledby={`cg-${g.id}`}>
          <h3 id={`cg-${g.id}`}>{g.title}</h3>
          <ul>{g.items.map((i) => renderItem(i))}</ul>
        </section>
      ))}

      <section className="checklist__group" aria-labelledby="cg-custom">
        <h3 id="cg-custom">Meus itens</h3>
        {state.custom.length > 0 && <ul>{state.custom.map((i) => renderItem(i, true))}</ul>}
        <form className="checklist__add" onSubmit={add}>
          <label htmlFor="novo-item" className="visually-hidden">
            Novo item
          </label>
          <input
            id="novo-item"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Adicionar item…"
            maxLength={80}
            autoComplete="off"
          />
          <button type="submit" className="btn btn--primary btn--small" disabled={!text.trim()}>
            <Plus size={18} aria-hidden="true" /> Adicionar
          </button>
        </form>
      </section>
    </Sheet>
  );
}

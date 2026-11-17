import {
  ArrowLeft,
  ArrowRight,
  Car,
  Check,
  Copy,
  Droplets,
  Fuel,
  IceCream2,
  Info,
  ParkingCircle,
  Plus,
  RotateCcw,
  Ship,
  ShoppingCart,
  Trash2,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { groups, initialExpenses, type Category, type Expense, type GroupId } from './data';
import { brl, computeBalances, settle, totalOf } from './settle';
import './gastos.css';

const categoryInfo: Record<Category, { label: string; icon: LucideIcon; color: string }> = {
  carro: { label: 'Aluguel do carro', icon: Car, color: '#0f6688' },
  mercado: { label: 'Mercado', icon: ShoppingCart, color: '#14b1a9' },
  uber: { label: 'Uber', icon: Users, color: '#2c4654' },
  gasolina: { label: 'Gasolina', icon: Fuel, color: '#ff6f4f' },
  estacionamento: { label: 'Estacionamento', icon: ParkingCircle, color: '#8a5cf6' },
  balsa: { label: 'Balsa', icon: Ship, color: '#0a8f8a' },
  gelo: { label: 'Gelo e bebidas', icon: Droplets, color: '#3cc9c0' },
  praia: { label: 'Praia', icon: IceCream2, color: '#c48a00' },
};

const groupById = Object.fromEntries(groups.map((g) => [g.id, g])) as Record<GroupId, (typeof groups)[number]>;
const PEOPLE = groups.reduce((n, g) => n + g.members, 0);

const weekday = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(date);
};

function Avatar({ id, size = 44 }: { id: GroupId; size?: number }) {
  const g = groupById[id];
  return (
    <span className="g-avatar" style={{ background: g.color, width: size, height: size, fontSize: size * 0.4 }} aria-hidden="true">
      {g.name[0]}
      {g.members > 1 && <span className="g-avatar__plus">+1</span>}
    </span>
  );
}

/** Contador animado para os valores principais. */
function CountUp({ cents }: { cents: number }) {
  const [shown, setShown] = useState(cents);
  const prev = useRef(cents);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const from = prev.current;
    prev.current = cents;
    if (reduce || from === cents) {
      setShown(cents);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 700);
      setShown(Math.round(from + (cents - from) * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cents]);
  return <>{brl(shown)}</>;
}

const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Maceio' }).format(new Date());

export default function GastosApp() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('gastos-maceio:lista', initialExpenses);
  const [paidTransfers, setPaidTransfers] = useLocalStorage<string[]>('gastos-maceio:transferencias-feitas', []);
  const [filterGroup, setFilterGroup] = useState<GroupId | null>(null);
  const [filterCat, setFilterCat] = useState<Category | null>(null);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ description: '', value: '', date: today(), group: 'diego' as GroupId, category: 'mercado' as Category });

  const total = totalOf(expenses);
  const balances = useMemo(() => computeBalances(groups, expenses), [expenses]);
  const transfers = useMemo(() => settle(balances), [balances]);
  const perPerson = total / PEOPLE;
  const modified = JSON.stringify(expenses) !== JSON.stringify(initialExpenses);
  const transferKey = (t: { from: string; to: string; cents: number }) => `${t.from}>${t.to}:${t.cents}`;
  const doneCount = transfers.filter((t) => paidTransfers.includes(transferKey(t))).length;

  const showToast = (text: string) => {
    setToast({ id: Date.now(), text });
    window.setTimeout(() => setToast((cur) => (cur && cur.text === text ? null : cur)), 2200);
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    showToast(label);
  };

  const summaryText = () => {
    const lines = [
      '*Gastos da viagem — Maragogi & Maceió*',
      `Total: ${brl(total)} · ${PEOPLE} pessoas · ${brl(Math.round(perPerson))} por pessoa`,
      '',
      '*Quem paga para quem:*',
      ...transfers.map((t) => `• ${groupById[t.from].name} → ${groupById[t.to].name}: ${brl(t.cents)}`),
      '',
      `Detalhes: ${window.location.href.split('#')[0]}`,
    ];
    return lines.join('\n');
  };

  const byCategory = useMemo(() => {
    const map = new Map<Category, number>();
    expenses.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.paidBy.reduce((s, p) => s + p.cents, 0)));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const visible = expenses
    .filter((e) => (!filterGroup || e.paidBy.some((p) => p.group === filterGroup)) && (!filterCat || e.category === filterCat))
    .sort((a, b) => a.date.localeCompare(b.date));
  const days = [...new Set(visible.map((e) => e.date))];

  const addExpense = (ev: FormEvent) => {
    ev.preventDefault();
    const cents = Math.round(parseFloat(form.value.replace(/\./g, '').replace(',', '.')) * 100);
    if (!form.description.trim() || !Number.isFinite(cents) || cents <= 0) {
      showToast('Preencha descrição e valor');
      return;
    }
    setExpenses([
      ...expenses,
      {
        id: `n${Date.now()}`,
        description: form.description.trim(),
        date: form.date,
        category: form.category,
        paidBy: [{ group: form.group, cents }],
      },
    ]);
    setForm({ ...form, description: '', value: '' });
    setFormOpen(false);
    showToast('Gasto adicionado — divisão atualizada');
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
    showToast('Gasto removido — divisão atualizada');
  };

  const maxPaid = Math.max(...balances.map((b) => Math.max(b.paid, b.owed)), 1);

  return (
    <div className="g-page">
      <header className="g-hero">
        <div className="g-wrap">
          <a className="g-back" href="/">
            <ArrowLeft size={18} aria-hidden="true" /> Roteiro da viagem
          </a>
          <p className="g-eyebrow">Maragogi & Maceió · 11 a 18/11/2026</p>
          <h1>
            Gastos da viagem, <em>divididos sem dor de cabeça</em>
          </h1>
          <div className="g-stats">
            <div className="g-stat g-stat--main">
              <span>Total gasto</span>
              <strong>
                <CountUp cents={total} />
              </strong>
            </div>
            <div className="g-stat">
              <span>Por pessoa</span>
              <strong>
                <CountUp cents={Math.round(perPerson)} />
              </strong>
            </div>
            <div className="g-stat">
              <span>Pessoas</span>
              <strong>{PEOPLE}</strong>
            </div>
            <div className="g-stat">
              <span>Gastos</span>
              <strong>{expenses.length}</strong>
            </div>
          </div>
        </div>
        <svg className="g-hero__wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 30c120 20 240 30 360 20S600 10 720 14s240 26 360 26 240-20 360-24v44H0z" />
        </svg>
      </header>

      <main className="g-wrap">
        {modified && (
          <div className="g-banner" role="status">
            <Info size={18} aria-hidden="true" />
            <span>A lista foi alterada neste aparelho. As outras pessoas só veem a lista original.</span>
            <button
              type="button"
              className="g-btn g-btn--ghost g-btn--sm"
              onClick={() => {
                setExpenses(initialExpenses);
                showToast('Lista original restaurada');
              }}
            >
              <RotateCcw size={16} aria-hidden="true" /> Restaurar
            </button>
          </div>
        )}

        {/* ---------------- Transferências ---------------- */}
        <section className="g-section" aria-labelledby="t-title">
          <div className="g-section__head">
            <div>
              <h2 id="t-title">Quem paga para quem</h2>
              <p>
                Transferências diretas, no menor número possível — ninguém precisa repassar dinheiro de ninguém.
              </p>
            </div>
            <span className="g-pill">
              {doneCount} de {transfers.length} feitas
            </span>
          </div>

          <div className="g-progress" aria-hidden="true">
            <span style={{ width: `${transfers.length ? (doneCount / transfers.length) * 100 : 100}%` }} />
          </div>

          {transfers.length === 0 ? (
            <p className="g-empty">Tudo certo: ninguém deve nada a ninguém. 🎉</p>
          ) : (
            <ol className="g-transfers">
              {transfers.map((t, i) => {
                const key = transferKey(t);
                const done = paidTransfers.includes(key);
                return (
                  <li key={key} className={`g-transfer ${done ? 'is-done' : ''}`} style={{ animationDelay: `${i * 70}ms` }}>
                    <div className="g-transfer__people">
                      <div className="g-person">
                        <Avatar id={t.from} />
                        <span>{groupById[t.from].name}</span>
                      </div>
                      <div className="g-transfer__arrow" aria-hidden="true">
                        <span className="g-transfer__dots" />
                        <ArrowRight size={20} />
                      </div>
                      <div className="g-person">
                        <Avatar id={t.to} />
                        <span>{groupById[t.to].name}</span>
                      </div>
                    </div>
                    <p className="g-transfer__amount">
                      <span className="visually-hidden">
                        {groupById[t.from].name} transfere para {groupById[t.to].name}:
                      </span>
                      {brl(t.cents)}
                    </p>
                    <p className="g-transfer__who">{groupById[t.from].label}</p>
                    <div className="g-transfer__actions">
                      <button
                        type="button"
                        className="g-btn g-btn--ghost g-btn--sm"
                        onClick={() => copy((t.cents / 100).toFixed(2).replace('.', ','), `Valor ${brl(t.cents)} copiado`)}
                      >
                        <Copy size={16} aria-hidden="true" /> Copiar valor
                      </button>
                      <button
                        type="button"
                        className={`g-btn g-btn--sm ${done ? 'g-btn--done' : 'g-btn--primary'}`}
                        aria-pressed={done}
                        onClick={() =>
                          setPaidTransfers(done ? paidTransfers.filter((k) => k !== key) : [...paidTransfers, key])
                        }
                      >
                        <Check size={16} aria-hidden="true" /> {done ? 'Pago!' : 'Marcar pago'}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <div className="g-share">
            <a
              className="g-btn g-btn--whats"
              href={`https://wa.me/?text=${encodeURIComponent(summaryText())}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3 1 2.6 1.1 2.7.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.6-.3Z"
                />
              </svg>
              Enviar no WhatsApp
            </a>
            <button type="button" className="g-btn g-btn--ghost" onClick={() => copy(summaryText(), 'Resumo copiado')}>
              <Copy size={18} aria-hidden="true" /> Copiar resumo
            </button>
          </div>
        </section>

        {/* ---------------- Saldos ---------------- */}
        <section className="g-section" aria-labelledby="b-title">
          <div className="g-section__head">
            <div>
              <h2 id="b-title">Quanto cada um pagou</h2>
              <p>
                Cada pessoa fica com <strong>{brl(Math.round(perPerson))}</strong>. Casais pagam duas cotas. Toque em
                um card para ver os gastos dele.
              </p>
            </div>
          </div>

          <ul className="g-balances">
            {balances.map((b) => {
              const active = filterGroup === b.group.id;
              return (
                <li key={b.group.id}>
                  <button
                    type="button"
                    className={`g-balance ${active ? 'is-active' : ''}`}
                    onClick={() => {
                      setFilterGroup(active ? null : b.group.id);
                      if (!active) document.getElementById('lista')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    aria-pressed={active}
                  >
                    <div className="g-balance__top">
                      <Avatar id={b.group.id} size={40} />
                      <div>
                        <strong>{b.group.name}</strong>
                        <small>
                          {b.group.label} · {b.group.members} {b.group.members > 1 ? 'cotas' : 'cota'}
                        </small>
                      </div>
                    </div>
                    <div className="g-bars" aria-hidden="true">
                      <span className="g-bar g-bar--paid" style={{ width: `${(b.paid / maxPaid) * 100}%`, background: b.group.color }} />
                      <span className="g-bar g-bar--owed" style={{ width: `${(b.owed / maxPaid) * 100}%` }} />
                    </div>
                    <dl className="g-balance__nums">
                      <div>
                        <dt>Pagou</dt>
                        <dd>{brl(b.paid)}</dd>
                      </div>
                      <div>
                        <dt>Cota</dt>
                        <dd>{brl(b.owed)}</dd>
                      </div>
                    </dl>
                    <p className={`g-balance__result ${b.balance > 0 ? 'is-plus' : b.balance < 0 ? 'is-minus' : ''}`}>
                      {b.balance > 0 ? `Recebe ${brl(b.balance)}` : b.balance < 0 ? `Paga ${brl(-b.balance)}` : 'Está quite'}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>

          <details className="g-how">
            <summary>
              <Info size={18} aria-hidden="true" /> Como a conta foi feita
            </summary>
            <ol>
              <li>
                Somamos todos os gastos: <strong>{brl(total)}</strong>.
              </li>
              <li>
                Dividimos por {PEOPLE} pessoas: <strong>{brl(Math.round(perPerson))}</strong> cada (casais = 2 cotas).
                Centavos que sobram da divisão são distribuídos para a soma fechar exata.
              </li>
              <li>Saldo = quanto o grupo pagou − a cota dele. Positivo recebe, negativo paga.</li>
              <li>
                Quem deve transfere <strong>direto</strong> para quem tem a receber, com o menor número de
                transferências possível.
              </li>
            </ol>
          </details>
        </section>

        {/* ---------------- Categorias ---------------- */}
        <section className="g-section" aria-labelledby="c-title">
          <div className="g-section__head">
            <div>
              <h2 id="c-title">Para onde foi o dinheiro</h2>
              <p>Toque numa categoria para filtrar a lista.</p>
            </div>
          </div>
          <ul className="g-cats">
            {byCategory.map(([cat, cents]) => {
              const info = categoryInfo[cat];
              const Icon = info.icon;
              const active = filterCat === cat;
              return (
                <li key={cat}>
                  <button
                    type="button"
                    className={`g-cat ${active ? 'is-active' : ''}`}
                    onClick={() => setFilterCat(active ? null : cat)}
                    aria-pressed={active}
                  >
                    <span className="g-cat__icon" style={{ color: info.color, background: `${info.color}1f` }} aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <span className="g-cat__label">{info.label}</span>
                    <span className="g-cat__value">
                      {brl(cents)} <small>{Math.round((cents / total) * 100)}%</small>
                    </span>
                    <span className="g-cat__bar" aria-hidden="true">
                      <span style={{ width: `${(cents / byCategory[0][1]) * 100}%`, background: info.color }} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---------------- Lista ---------------- */}
        <section className="g-section" id="lista" aria-labelledby="l-title">
          <div className="g-section__head">
            <div>
              <h2 id="l-title">Todos os gastos</h2>
              <p>
                {visible.length} de {expenses.length} gastos
                {(filterGroup || filterCat) && ' (filtrado)'}
              </p>
            </div>
            <button type="button" className="g-btn g-btn--primary" onClick={() => setFormOpen((v) => !v)} aria-expanded={formOpen}>
              <Plus size={18} aria-hidden="true" /> Novo gasto
            </button>
          </div>

          {formOpen && (
            <form className="g-form" onSubmit={addExpense}>
              <label>
                Descrição
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Ex.: Almoço, gelo, pedágio…"
                  maxLength={60}
                  required
                />
              </label>
              <label>
                Valor (R$)
                <input
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  inputMode="decimal"
                  placeholder="0,00"
                  required
                />
              </label>
              <label>
                Quem pagou
                <select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value as GroupId })}>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Categoria
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
                  {Object.entries(categoryInfo).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Data
                <input type="date" value={form.date} min="2026-11-11" max="2026-11-18" onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </label>
              <div className="g-form__actions">
                <button type="submit" className="g-btn g-btn--primary">
                  <Plus size={18} aria-hidden="true" /> Adicionar
                </button>
                <p>Fica salvo só neste aparelho. Para valer para todos, peça para atualizar o site.</p>
              </div>
            </form>
          )}

          {(filterGroup || filterCat) && (
            <div className="g-filters">
              {filterGroup && (
                <button type="button" className="g-chip" onClick={() => setFilterGroup(null)}>
                  Pago por {groupById[filterGroup].name} ✕
                </button>
              )}
              {filterCat && (
                <button type="button" className="g-chip" onClick={() => setFilterCat(null)}>
                  {categoryInfo[filterCat].label} ✕
                </button>
              )}
            </div>
          )}

          {days.map((day) => {
            const items = visible.filter((e) => e.date === day);
            const dayTotal = items.reduce((s, e) => s + e.paidBy.reduce((a, p) => a + p.cents, 0), 0);
            return (
              <div key={day} className="g-day">
                <h3>
                  <span>{weekday(day)}</span>
                  <small>{brl(dayTotal)}</small>
                </h3>
                <ul>
                  {items.map((e) => {
                    const info = categoryInfo[e.category];
                    const Icon = info.icon;
                    const value = e.paidBy.reduce((s, p) => s + p.cents, 0);
                    return (
                      <li key={e.id} className="g-exp">
                        <span className="g-exp__icon" style={{ color: info.color, background: `${info.color}1f` }} aria-hidden="true">
                          <Icon size={20} />
                        </span>
                        <div className="g-exp__main">
                          <strong>{e.description}</strong>
                          <span className="g-exp__payers">
                            {e.paidBy.map((p, i) => (
                              <span key={i} className="g-exp__payer">
                                <Avatar id={p.group} size={20} />
                                {p.note ? `${p.note} (casal ${groupById[p.group].name})` : groupById[p.group].name}
                                {e.paidBy.length > 1 && ` · ${brl(p.cents)}`}
                              </span>
                            ))}
                          </span>
                        </div>
                        <span className="g-exp__value">{brl(value)}</span>
                        <button
                          type="button"
                          className="g-exp__del"
                          onClick={() => removeExpense(e.id)}
                          aria-label={`Remover ${e.description} de ${brl(value)}`}
                          title="Remover"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          {visible.length === 0 && <p className="g-empty">Nenhum gasto com esse filtro.</p>}
        </section>

        <footer className="g-footer">
          <Wallet size={18} aria-hidden="true" /> Os valores marcados como pagos e os gastos adicionados ficam salvos só neste
          aparelho.
        </footer>
      </main>

      <div className="g-toast-region" role="status" aria-live="polite">
        {toast && (
          <div className="g-toast" key={toast.id}>
            <Check size={18} aria-hidden="true" /> {toast.text}
          </div>
        )}
      </div>
    </div>
  );
}

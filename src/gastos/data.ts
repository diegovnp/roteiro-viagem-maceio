/**
 * GASTOS DA VIAGEM — edite aqui.
 *
 * - `groups`: quem divide a conta. `members` = quantas pessoas o grupo paga
 *   (casal = 2). A soma de `members` é o total de pessoas (9).
 * - `expenses`: cada gasto. `paidBy` lista quem pagou e quanto
 *   (para um gasto pago por uma pessoa só, basta um item).
 */

export type GroupId = 'diego' | 'daniel' | 'juraci' | 'abraao' | 'estevao' | 'gabriel';

export interface Group {
  id: GroupId;
  name: string;
  /** Quem está incluído no grupo. */
  label: string;
  members: number;
  color: string;
}

export type Category = 'carro' | 'mercado' | 'uber' | 'estacionamento' | 'balsa' | 'gasolina' | 'gelo' | 'praia';

export interface Expense {
  id: string;
  description: string;
  /** yyyy-mm-dd */
  date: string;
  category: Category;
  /** Pagamentos, em centavos. */
  paidBy: { group: GroupId; cents: number; note?: string }[];
}

export const groups: Group[] = [
  { id: 'diego', name: 'Diego', label: 'Diego + esposa (Ana Leia)', members: 2, color: '#ff6f4f' },
  { id: 'daniel', name: 'Daniel', label: 'Daniel + esposa', members: 2, color: '#14b1a9' },
  { id: 'juraci', name: 'Juraci', label: 'Juraci + esposa', members: 2, color: '#0f6688' },
  { id: 'abraao', name: 'Abraão', label: 'Abraão', members: 1, color: '#c48a00' },
  { id: 'estevao', name: 'Estevão', label: 'Estevão', members: 1, color: '#8a5cf6' },
  { id: 'gabriel', name: 'Gabriel', label: 'Gabriel', members: 1, color: '#e0457b' },
];

const r = (reais: number) => Math.round(reais * 100);

export const initialExpenses: Expense[] = [
  { id: 'e01', date: '2026-11-11', category: 'carro', description: 'Aluguel do carro', paidBy: [{ group: 'diego', cents: r(582) }] },
  { id: 'e01b', date: '2026-11-11', category: 'carro', description: 'Aluguel do carro', paidBy: [{ group: 'daniel', cents: r(563.47) }] },
  { id: 'e02', date: '2026-11-11', category: 'mercado', description: 'Compras no Atacadão', paidBy: [{ group: 'diego', cents: r(212) }] },
  { id: 'e03', date: '2026-11-11', category: 'uber', description: 'Uber', paidBy: [{ group: 'daniel', cents: r(258.41) }] },
  { id: 'e04', date: '2026-11-11', category: 'uber', description: 'Uber', paidBy: [{ group: 'gabriel', cents: r(267.92) }] },
  { id: 'e05', date: '2026-11-12', category: 'estacionamento', description: 'Estacionamento', paidBy: [{ group: 'diego', cents: r(25) }] },
  { id: 'e06', date: '2026-11-12', category: 'estacionamento', description: 'Estacionamento', paidBy: [{ group: 'juraci', cents: r(40) }] },
  { id: 'e07', date: '2026-11-13', category: 'balsa', description: 'Balsa', paidBy: [{ group: 'diego', cents: r(48) }] },
  { id: 'e08', date: '2026-11-13', category: 'gasolina', description: 'Gasolina', paidBy: [{ group: 'daniel', cents: r(245) }] },
  { id: 'e09', date: '2026-11-13', category: 'gasolina', description: 'Gasolina', paidBy: [{ group: 'diego', cents: r(183) }] },
  { id: 'e10', date: '2026-11-14', category: 'mercado', description: 'Compras', paidBy: [{ group: 'diego', cents: r(404) }] },
  { id: 'e11', date: '2026-11-14', category: 'gelo', description: 'Gelo', paidBy: [{ group: 'diego', cents: r(10) }] },
  { id: 'e12', date: '2026-11-15', category: 'gelo', description: 'Água e gelo', paidBy: [{ group: 'juraci', cents: r(30) }] },
  { id: 'e13', date: '2026-11-15', category: 'estacionamento', description: 'Estacionamento', paidBy: [{ group: 'diego', cents: r(30) }] },
  {
    id: 'e14',
    date: '2026-11-15',
    category: 'praia',
    description: 'Bombom aberto na praia',
    paidBy: [{ group: 'diego', cents: r(15), note: 'Ana Leia' }],
  },
  { id: 'e15', date: '2026-11-16', category: 'gelo', description: 'Gelo', paidBy: [{ group: 'diego', cents: r(8) }] },
  { id: 'e16', date: '2026-11-16', category: 'estacionamento', description: 'Estacionamento', paidBy: [{ group: 'diego', cents: r(13) }] },
  { id: 'e16b', date: '2026-11-16', category: 'estacionamento', description: 'Estacionamento', paidBy: [{ group: 'daniel', cents: r(13) }] },
  { id: 'e17', date: '2026-11-16', category: 'gelo', description: 'Coca', paidBy: [{ group: 'diego', cents: r(15) }] },
  { id: 'e18', date: '2026-11-16', category: 'mercado', description: 'Mercado', paidBy: [{ group: 'diego', cents: r(75) }] },
  { id: 'e19', date: '2026-11-17', category: 'gelo', description: 'Gelo', paidBy: [{ group: 'juraci', cents: r(20) }] },
  { id: 'e20', date: '2026-11-17', category: 'gasolina', description: 'Gasolina', paidBy: [{ group: 'diego', cents: r(172.95) }] },
  { id: 'e21', date: '2026-11-17', category: 'gasolina', description: 'Gasolina', paidBy: [{ group: 'daniel', cents: r(191.43) }] },
];

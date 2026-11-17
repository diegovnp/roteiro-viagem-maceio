import type { Expense, Group, GroupId } from './data';

export interface Balance {
  group: Group;
  paid: number; // centavos
  owed: number; // centavos (cota do grupo)
  balance: number; // positivo = tem a receber
}

export interface Transfer {
  from: GroupId;
  to: GroupId;
  cents: number;
}

export const totalOf = (expenses: Expense[]) =>
  expenses.reduce((sum, e) => sum + e.paidBy.reduce((s, p) => s + p.cents, 0), 0);

/**
 * Cota de cada grupo proporcional ao número de pessoas, em centavos inteiros.
 * Os centavos que sobram do arredondamento vão para os grupos com maior fração
 * (método do maior resto), então a soma das cotas bate exatamente com o total.
 */
export function computeBalances(groups: Group[], expenses: Expense[]): Balance[] {
  const total = totalOf(expenses);
  const people = groups.reduce((n, g) => n + g.members, 0);
  const exact = groups.map((g) => (total * g.members) / people);
  const owed = exact.map(Math.floor);
  let rest = total - owed.reduce((a, b) => a + b, 0);
  exact
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac)
    .forEach(({ i }) => {
      if (rest > 0) {
        owed[i] += 1;
        rest -= 1;
      }
    });

  return groups.map((g, i) => {
    const paid = expenses.reduce(
      (sum, e) => sum + e.paidBy.filter((p) => p.group === g.id).reduce((s, p) => s + p.cents, 0),
      0,
    );
    return { group: g, paid, owed: owed[i], balance: paid - owed[i] };
  });
}

/**
 * Transferências diretas (sem intermediários): quem deve paga direto para quem tem a
 * receber, em poucas transferências e, sempre que possível, cada pessoa pagando
 * uma única outra pessoa.
 */
export function settle(balances: Balance[]): Transfer[] {
  const debtors = balances.filter((b) => b.balance < 0).map((b) => ({ id: b.group.id, v: -b.balance }));
  const creditors = balances.filter((b) => b.balance > 0).map((b) => ({ id: b.group.id, v: b.balance }));
  const transfers: Transfer[] = [];

  // 1º: cada devedor (do maior para o menor) paga TUDO a um único credor, se algum
  // ainda tiver saldo suficiente (o de menor sobra, para não "desperdiçar" os grandes).
  debtors.sort((a, b) => b.v - a.v);
  for (const d of debtors) {
    const fit = creditors.filter((c) => c.v >= d.v).sort((a, b) => a.v - b.v)[0];
    if (fit) {
      transfers.push({ from: d.id, to: fit.id, cents: d.v });
      fit.v -= d.v;
      d.v = 0;
    }
  }
  for (let i = debtors.length - 1; i >= 0; i--) if (debtors[i].v === 0) debtors.splice(i, 1);
  for (let i = creditors.length - 1; i >= 0; i--) if (creditors[i].v === 0) creditors.splice(i, 1);

  // 2º: o que sobrar é dividido de forma gulosa (maior devedor → maior credor).
  while (debtors.length && creditors.length) {
    debtors.sort((a, b) => b.v - a.v);
    creditors.sort((a, b) => b.v - a.v);
    const d = debtors[0];
    const c = creditors[0];
    const cents = Math.min(d.v, c.v);
    if (cents > 0) transfers.push({ from: d.id, to: c.id, cents });
    d.v -= cents;
    c.v -= cents;
    if (d.v === 0) debtors.shift();
    if (c.v === 0) creditors.shift();
  }
  return transfers.sort((a, b) => b.cents - a.cents);
}

export const brl = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

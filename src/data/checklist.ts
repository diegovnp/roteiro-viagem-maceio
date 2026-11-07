/**
 * Itens sugeridos para o checklist. Edite à vontade —
 * o estado (marcado/desmarcado) fica salvo no navegador.
 */
export interface ChecklistGroup {
  id: string;
  title: string;
  items: { id: string; label: string }[];
}

export const checklistGroups: ChecklistGroup[] = [
  {
    id: 'docs',
    title: 'Documentos',
    items: [
      { id: 'doc-id', label: 'Documento de identidade com foto' },
      { id: 'doc-cnh', label: 'CNH (para retirar e dirigir o carro alugado)' },
      { id: 'doc-voo', label: 'Cartões de embarque / dados dos voos' },
      { id: 'doc-reservas', label: 'Confirmações das hospedagens e do carro' },
      { id: 'doc-cartoes', label: 'Cartões e um pouco de dinheiro' },
    ],
  },
  {
    id: 'mala',
    title: 'Malas',
    items: [
      { id: 'mala-roupas', label: 'Roupas leves' },
      { id: 'mala-banho', label: 'Roupas de banho' },
      { id: 'mala-chinelo', label: 'Chinelo e sandália' },
      { id: 'mala-casaco', label: 'Casaco leve para o avião' },
      { id: 'mala-necessaire', label: 'Nécessaire e itens de higiene' },
      { id: 'mala-remedios', label: 'Remédios de uso pessoal' },
    ],
  },
  {
    id: 'praia',
    title: 'Praia',
    items: [
      { id: 'praia-protetor', label: 'Protetor solar' },
      { id: 'praia-oculos', label: 'Óculos de sol' },
      { id: 'praia-chapeu', label: 'Chapéu ou boné' },
      { id: 'praia-toalha', label: 'Toalha de praia' },
      { id: 'praia-saida', label: 'Saída de praia' },
      { id: 'praia-bolsa', label: 'Bolsa estanque para o celular' },
      { id: 'praia-garrafa', label: 'Garrafa de água reutilizável' },
      { id: 'praia-repelente', label: 'Repelente' },
      { id: 'praia-possol', label: 'Hidratante pós-sol' },
    ],
  },
  {
    id: 'eletronicos',
    title: 'Eletrônicos',
    items: [
      { id: 'ele-carregadores', label: 'Carregadores' },
      { id: 'ele-powerbank', label: 'Power bank' },
      { id: 'ele-carro', label: 'Carregador veicular / suporte de celular' },
      { id: 'ele-fones', label: 'Fones de ouvido' },
    ],
  },
];

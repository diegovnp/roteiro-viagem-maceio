import type { Day } from '../types/itinerary';

/**
 * ROTEIRO DA VIAGEM — edite aqui datas, títulos, textos e atividades.
 *
 * Regras usadas neste arquivo (vieram do roteiro original):
 * - `time` só aparece quando o horário foi informado.
 * - `condition` preserva "se houver tempo", "se estiver favorável" etc.
 * - Marés são referências fornecidas pelo viajante, não dados oficiais.
 * - `placeId` liga a atividade a um local de `src/data/places.ts`
 *   (botão "Abrir no mapa" + destaque no mapa esquemático).
 * - `cover` é um id de foto de `src/data/photos.ts`.
 */

export const trip = {
  title: 'Maceió',
  tagline: 'uma viagem pelo paraíso de Alagoas',
  subtitle:
    'Oito dias de mar azul-turquesa, piscinas naturais, coqueirais e estrada beira-mar — do litoral norte ao sul de Alagoas.',
  destination: 'Maceió e litoral de Alagoas',
  period: '11 a 18 de novembro de 2026',
  periodShort: '11–18/11/2026',
  duration: '8 dias no calendário',
  durationNote: 'Retorno na madrugada do dia 18',
  bases: ['Maragogi', 'Maceió'],
  startDate: '2026-11-11',
  endDate: '2026-11-18',
};

export const days: Day[] = [
  {
    number: 1,
    date: '2026-11-11',
    weekday: 'Quarta-feira',
    weekdayShort: 'Qua',
    title: 'Chegada + deslocamento para Maragogi',
    short: 'Chegada',
    summary:
      'Pousar em Maceió, pegar o carro, almoçar e seguir pela estrada rumo à primeira base da viagem: Maragogi.',
    cover: 'orla-maceio',
    base: 'Maragogi',
    activities: [
      {
        id: 'd1-chegada',
        kind: 'flight',
        title: 'Chegada a Maceió',
        time: 'por volta de 11h',
        placeId: 'aeroporto',
      },
      {
        id: 'd1-carro',
        kind: 'car',
        title: 'Retirada e aluguel do carro',
      },
      {
        id: 'd1-almoco',
        kind: 'food',
        title: 'Almoço na cidade',
        placeId: 'maceio',
      },
      {
        id: 'd1-estrada',
        kind: 'car',
        title: 'Saída em direção a Maragogi',
        duration: 'cerca de 2h30 de deslocamento',
      },
      {
        id: 'd1-checkin',
        kind: 'hotel',
        title: 'Check-in na hospedagem em Maragogi',
      },
      {
        id: 'd1-centro',
        kind: 'sunset',
        title: 'Aproveitar o final do dia no centro',
        placeId: 'maragogi',
      },
    ],
    tips: [
      'O deslocamento até Maragogi leva cerca de 2h30 — vale contar esse tempo ao planejar o almoço.',
      'Primeira noite em Maragogi: dia leve, para chegar e se ambientar.',
    ],
  },
  {
    number: 2,
    date: '2026-11-12',
    weekday: 'Quinta-feira',
    weekdayShort: 'Qui',
    title: 'Maragogi + Antunes + Xaréu',
    short: 'Piscinas',
    summary:
      'O dia das piscinas naturais: passeio de barco pela manhã, almoço e uma tarde de praia entre Antunes e Xaréu.',
    cover: 'xareu',
    base: 'Maragogi',
    tide: {
      label: 'Maré baixa',
      height: '0,41 m',
      time: '11h04',
    },
    activities: [
      {
        id: 'd2-praia-antes',
        kind: 'beach',
        title: 'Aproveitar a praia antes do passeio',
        condition: 'Dependendo do horário do passeio de barco',
        placeId: 'maragogi',
      },
      {
        id: 'd2-piscinas',
        kind: 'boat',
        title: 'Passeio de lancha ou catamarã até as piscinas naturais',
        time: 'pela manhã',
        duration: 'cerca de 2h30',
        placeId: 'piscinas',
        description:
          'Passeios às piscinas naturais dependem das condições do mar, da maré e da operação local.',
      },
      {
        id: 'd2-almoco',
        kind: 'food',
        title: 'Retorno e almoço',
      },
      {
        id: 'd2-antunes',
        kind: 'beach',
        title: 'Tarde na Praia de Antunes',
        time: 'à tarde',
        placeId: 'antunes',
      },
      {
        id: 'd2-xareu',
        kind: 'beach',
        title: 'Conhecer a Praia de Xaréu',
        placeId: 'xareu',
      },
    ],
    tips: [
      'Confirme com a operadora o horário de saída do barco: ele define se dá para curtir a praia antes.',
      'A maré informada é uma referência do roteiro — confira a tábua de marés oficial antes de sair.',
    ],
  },
  {
    number: 3,
    date: '2026-11-13',
    weekday: 'Sexta-feira',
    weekdayShort: 'Sex',
    title: 'Saída de Maragogi + litoral norte',
    short: 'Litoral norte',
    summary:
      'Um dia de estrada com várias paradas pelo litoral norte, de Maragogi até Maceió, mergulhando em uma praia atrás da outra.',
    cover: 'patacho',
    base: 'Maceió',
    tide: {
      label: 'Maré baixa',
      height: '0,50 m',
      time: '11h38',
      note: 'Referência anterior — confirmar a tábua de marés atualizada antes da viagem.',
    },
    flags: { multiStop: true },
    activities: [
      {
        id: 'd3-checkout',
        kind: 'hotel',
        title: 'Check-out e saída cedo de Maragogi',
        time: 'cedo',
      },
      {
        id: 'd3-croas',
        kind: 'viewpoint',
        title: 'Crôas de São Bento',
        description: 'Parada para admirar a paisagem.',
        placeId: 'croas',
      },
      {
        id: 'd3-patacho',
        kind: 'beach',
        title: 'Praia do Patacho',
        description: 'Banho de mar.',
        placeId: 'patacho',
      },
      {
        id: 'd3-laje',
        kind: 'beach',
        title: 'Praia da Laje',
        description: 'Banho de mar.',
        placeId: 'laje',
      },
      {
        id: 'd3-toque',
        kind: 'beach',
        title: 'Praia do Toque',
        description: 'Banho de mar.',
        placeId: 'toque',
      },
      {
        id: 'd3-milagres',
        kind: 'beach',
        title: 'São Miguel dos Milagres',
        description: 'Banho de mar.',
        placeId: 'milagres',
      },
      {
        id: 'd3-almoco',
        kind: 'food',
        title: 'Almoço durante o percurso',
      },
      {
        id: 'd3-marceneiro',
        kind: 'beach',
        title: 'Praia do Marceneiro',
        condition: 'Se houver tempo',
        placeId: 'marceneiro',
      },
      {
        id: 'd3-retorno',
        kind: 'car',
        title: 'Retorno a Maceió',
        time: 'no final da tarde',
      },
      {
        id: 'd3-checkin',
        kind: 'hotel',
        title: 'Check-in na hospedagem em Maceió',
      },
    ],
    tips: [
      'São muitas paradas para um dia só: a quantidade de praias pode exigir ajustes conforme o tempo disponível.',
      'Escolha de antemão quais praias são prioridade, caso seja preciso encurtar o trajeto.',
    ],
  },
  {
    number: 4,
    date: '2026-11-14',
    weekday: 'Sábado',
    weekdayShort: 'Sáb',
    title: 'Maceió: praias + passeio pela cidade',
    short: 'Ipioca',
    summary: 'Dia para aproveitar o litoral norte de Maceió, com manhã em Ipioca e parada na Praia da Sereia.',
    cover: 'ipioca',
    base: 'Maceió',
    activities: [
      {
        id: 'd4-ipioca',
        kind: 'beach',
        title: 'Manhã na Praia de Ipioca',
        time: 'pela manhã',
        placeId: 'ipioca',
      },
      {
        id: 'd4-sereia',
        kind: 'beach',
        title: 'Praia da Sereia',
        placeId: 'sereia',
      },
      {
        id: 'd4-almoco',
        kind: 'food',
        title: 'Almoço na região',
      },
    ],
    tips: ['Primeiro dia inteiro com base em Maceió — sem check-in nem check-out.'],
  },
  {
    number: 5,
    date: '2026-11-15',
    weekday: 'Domingo',
    weekdayShort: 'Dom',
    title: 'Dia livre + possibilidade de Ipioca',
    short: 'Orla',
    summary:
      'Um dia mais solto na cidade: Ponta Verde, Pajuçara, Marco dos Corais e muito passeio pela orla.',
    cover: 'ponta-verde',
    base: 'Maceió',
    activities: [
      {
        id: 'd5-mare',
        kind: 'tide',
        title: 'Conferir a maré',
        time: 'pela manhã',
        description: 'Se estiver favorável, conhecer a região do Farol de Ponta Verde.',
      },
      {
        id: 'd5-farol',
        kind: 'walk',
        title: 'Região do Farol de Ponta Verde',
        condition: 'Se a maré estiver favorável',
        placeId: 'farol',
      },
      {
        id: 'd5-pontaverde',
        kind: 'beach',
        title: 'Praia de Ponta Verde',
        placeId: 'pontaVerde',
      },
      {
        id: 'd5-pajucara',
        kind: 'beach',
        title: 'Praia de Pajuçara',
        placeId: 'pajucara',
      },
      {
        id: 'd5-corais',
        kind: 'tour',
        title: 'Conhecer o Marco dos Corais',
        placeId: 'corais',
      },
      {
        id: 'd5-orla',
        kind: 'walk',
        title: 'Passear pela orla e pela cidade',
        placeId: 'orla',
      },
      {
        id: 'd5-almoco',
        kind: 'food',
        title: 'Almoço em Maceió',
      },
      {
        id: 'd5-tarde',
        kind: 'city',
        title: 'Tarde livre',
        time: 'à tarde',
        description: 'Para conhecer outros pontos da cidade ou aproveitar a praia.',
      },
      {
        id: 'd5-fim',
        kind: 'sunset',
        title: 'Fim de tarde na orla',
        time: 'fim de tarde',
        placeId: 'orla',
      },
    ],
    tips: [
      'Sem horário de maré informado para este dia — confira a tábua de marés pela manhã antes de ir ao farol.',
    ],
  },
  {
    number: 6,
    date: '2026-11-16',
    weekday: 'Segunda-feira',
    weekdayShort: 'Seg',
    title: 'Litoral sul: Praia do Francês',
    short: 'Francês',
    summary: 'Rumo ao litoral sul para um dia inteiro de praia no Francês.',
    cover: 'frances',
    base: 'Maceió',
    activities: [
      {
        id: 'd6-saida',
        kind: 'car',
        title: 'Saída em direção à Praia do Francês',
        time: 'pela manhã',
      },
      {
        id: 'd6-almoco',
        kind: 'food',
        title: 'Almoço na região',
      },
      {
        id: 'd6-praia',
        kind: 'beach',
        title: 'Tarde livre na praia',
        time: 'à tarde',
        placeId: 'frances',
      },
      {
        id: 'd6-retorno',
        kind: 'car',
        title: 'Retorno a Maceió',
      },
    ],
    tips: ['Dia sem pressa: a programação é praticamente toda de praia.'],
  },
  {
    number: 7,
    date: '2026-11-17',
    weekday: 'Terça-feira',
    weekdayShort: 'Ter',
    title: 'Barra de São Miguel + Praia do Gunga',
    short: 'Gunga',
    summary:
      'Mirante, quadriciclo e as águas do Gunga pela manhã; almoço e tarde de praia na Barra de São Miguel.',
    cover: 'gunga',
    base: 'Maceió',
    flags: { swappable: true },
    activities: [
      {
        id: 'd7-saida',
        kind: 'car',
        title: 'Saída em direção à Praia do Gunga',
        time: 'pela manhã',
        placeId: 'gunga',
      },
      {
        id: 'd7-mirante',
        kind: 'viewpoint',
        title: 'Conhecer o Mirante do Gunga',
        placeId: 'mirante',
      },
      {
        id: 'd7-quadri',
        kind: 'quad',
        title: 'Passeio de quadriciclo',
      },
      {
        id: 'd7-barra',
        kind: 'car',
        title: 'Seguir em direção à Barra de São Miguel',
        placeId: 'barra',
      },
      {
        id: 'd7-almoco',
        kind: 'food',
        title: 'Almoço na região',
      },
      {
        id: 'd7-tarde',
        kind: 'beach',
        title: 'Aproveitar a praia e a tarde',
        time: 'à tarde',
        placeId: 'barra',
      },
      {
        id: 'd7-retorno',
        kind: 'car',
        title: 'Retorno a Maceió',
      },
    ],
    tips: [
      'Último dia de passeios: se preferirem, ele pode ser trocado por repetir algum destino favorito da viagem.',
    ],
  },
  {
    number: 8,
    date: '2026-11-18',
    weekday: 'Quarta-feira',
    weekdayShort: 'Qua',
    title: 'Retorno',
    short: 'Retorno',
    summary:
      'Dia apenas de retorno: a saída da hospedagem acontece durante a madrugada, para o voo das 04h.',
    cover: 'entardecer',
    flags: { returnOnly: true },
    activities: [
      {
        id: 'd8-checkout',
        kind: 'hotel',
        title: 'Check-out',
        time: 'durante a madrugada',
      },
      {
        id: 'd8-aeroporto',
        kind: 'car',
        title: 'Deslocamento para o aeroporto',
        placeId: 'aeroporto',
      },
      {
        id: 'd8-voo',
        kind: 'flight',
        title: 'Voo de volta',
        time: '04h',
      },
    ],
    tips: [
      'Como o voo é às 04h, na prática a noite de 17/11 já é a despedida: deixe as malas prontas antes de dormir.',
    ],
  },
];

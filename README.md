# Maceió — uma viagem pelo paraíso de Alagoas 🌴

Site interativo do roteiro da viagem a Maceió e ao litoral de Alagoas, de **11 a 18 de novembro de 2026**.
Feito com **React + Vite + TypeScript**, 100% estático e pronto para publicar na **Vercel**.

## O que tem no site

- **Abertura (hero)** com foto, ondas animadas e botão “Explorar roteiro”.
- **Resumo da viagem**: destino, período, duração, bases de hospedagem, contagem regressiva, calendário clicável e
  **mapa esquemático** do litoral com os destinos.
- **Roleta de dias** (celular/tablet): barra fixa na parte de baixo da tela. Arraste para girar, toque em um dia ou use
  as setas. Ela gira sozinha quando o dia muda por outro controle.
- **Trilha ilustrada** (desktop): rota ondulada com as 8 paradas e um barquinho que navega até o dia selecionado.
- **Página de cada dia**: capa, data, objetivo do dia, maré (quando informada), avisos (várias paradas, dia flexível,
  retorno de madrugada), programação em linha do tempo, mapa do dia com os pontos numerados, dicas e anotações.
- **Extras**: checklist da viagem, favoritos, resumo rápido do dia, compartilhamento (nativo ou copiar link),
  progresso de dias vistos, modo de leitura (menos animação) e notas por dia.
  Checklist, favoritos, notas e progresso ficam salvos **só no navegador** (localStorage).
- Link direto para um dia: `https://seu-site.vercel.app/#dia-3`.

## Rodar localmente

Requisitos: **Node.js 18+** (recomendado 20 ou 22).

```bash
npm install
```

```bash
npm run dev
```

Abra o endereço mostrado no terminal (normalmente http://localhost:5173).

Build de produção e pré-visualização:

```bash
npm run build
```

```bash
npm run preview
```

## Enviar para o GitHub

Se o repositório ainda não estiver ligado ao GitHub:

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Site do roteiro de Maceió"
```

```bash
git remote add origin https://github.com/SEU-USUARIO/roteiro-viagem-maceio.git
```

```bash
git push -u origin main
```

## Publicar na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório do GitHub.
2. A Vercel detecta o **Vite** sozinha. Confirme:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Clique em **Deploy**. A cada `git push` na branch principal o site é atualizado.

As meta tags de compartilhamento (Open Graph) usam automaticamente o domínio de produção da Vercel.
Se usar um domínio próprio, crie a variável de ambiente `SITE_URL` (ex.: `https://maceio.meusite.com`) nas
configurações do projeto na Vercel.

O arquivo `vercel.json` só define cache para as imagens e os arquivos de `assets/`. Não precisa de backend, banco de
dados nem chaves de API.

## Onde editar o conteúdo

| O quê | Arquivo |
| --- | --- |
| **Dias, datas, títulos, atividades, horários, marés, dicas** | `src/data/itinerary.ts` |
| Dados gerais (título, período, bases) | `src/data/itinerary.ts` → objeto `trip` |
| **Locais**, links do Google Maps e posição no mapa | `src/data/places.ts` |
| Contorno do litoral no mapa esquemático | `src/data/map.ts` |
| Itens do checklist | `src/data/checklist.ts` |
| **Fotos** (qual arquivo do Commons, texto alternativo) | `scripts/photo-sources.json` |
| Tipos (estrutura dos dados) | `src/types/itinerary.ts` |
| Cores, fontes e espaçamentos | `src/styles/global.css` (variáveis no topo) |

### Editar um dia

Cada dia em `src/data/itinerary.ts` tem `date`, `weekday`, `title`, `summary`, `cover` (id da foto) e `activities`.
Cada atividade aceita:

- `kind` → ícone (`car`, `beach`, `boat`, `food`, `hotel`, `walk`, `tour`, `viewpoint`, `quad`, `city`, `sunset`,
  `flight`, `tide`);
- `time` e `duration` → **só preencha quando o horário/duração forem conhecidos**;
- `condition` → condições como “Se houver tempo” (aparecem destacadas);
- `placeId` → liga a atividade a um local de `places.ts` (habilita “Abrir no mapa”, “Ver fotos” e o ponto no mapa).

Marés ficam em `tide` (`height`, `time` e `note` opcional). Avisos especiais em `flags`
(`multiStop`, `swappable`, `returnOnly`).

### Fotos

Todas as fotos são do **Wikimedia Commons** (licenças livres), escolhidas uma a uma para corresponder ao local.
Autor, licença e link de cada uma aparecem em **“Créditos das fotos”**, no rodapé, e também sobre cada imagem.

- A foto da abertura (Praia de Antunes) já está otimizada em `public/images/` (WebP em 3 tamanhos).
- As demais são carregadas das **miniaturas oficiais do Commons** (`upload.wikimedia.org`, tamanhos padrão
  500/960/1280/1920 px com `srcset`). Durante a criação do site o Wikimedia limitou os downloads feitos por script a
  partir do servidor de desenvolvimento, por isso elas ainda não foram copiadas para o projeto.
- Para **hospedar todas as fotos no próprio site** (recomendado), rode na sua máquina:

```bash
npm run images
```

O script baixa cada foto listada em `scripts/photo-sources.json`, gera `public/images/<id>-<largura>.webp`, guarda
autor e licença e reescreve `src/data/photos.ts` — a partir daí nenhuma imagem depende de servidor externo.
Depois, faça commit da pasta `public/images` e de `src/data/photos.ts`.

Para **trocar ou adicionar** uma foto: encontre o arquivo no [Commons](https://commons.wikimedia.org), copie o título
(ex.: `File:Praia do Gunga 140.jpg`), adicione/edite a entrada em `scripts/photo-sources.json` (`id`, `file`, `alt`) e
rode `npm run images`. Use o `id` em `cover` (dias, em `itinerary.ts`) ou `photo` (locais, em `places.ts`).

Se uma foto não existir ou falhar ao carregar, o site mostra uma ilustração no lugar — nunca uma imagem errada.
Não foi encontrada foto livre da **Praia da Laje** nem do **centro de Maragogi**; esses locais ficam sem foto.

## Estrutura

```text
├── public/            favicon, imagem de compartilhamento e fotos otimizadas (images/)
├── scripts/           fetch-images.mjs + photo-sources.json (pipeline de fotos)
├── src/
│   ├── components/    Hero, TripOverview, RouteMap, DayTimeline (roleta), RouteTrail (desktop),
│   │                  DayContent, TripChecklist, Favorites, QuickSummary, Sheet, Toast, Footer…
│   ├── data/          itinerary.ts, places.ts, photos.ts, checklist.ts, map.ts
│   ├── hooks/         localStorage, media query, animações de entrada, modo de leitura
│   ├── styles/        tokens globais e estilos de página
│   ├── types/         tipos do roteiro
│   └── utils/         datas e projeção do mapa
├── index.html         SEO e Open Graph
└── vercel.json        cache de arquivos estáticos
```

## Acessibilidade e desempenho

- Navegação completa por teclado (setas na roleta, foco visível, painéis com `<dialog>` que fecham com Esc).
- Respeita `prefers-reduced-motion`; o **modo de leitura** (ícone ✨ no topo) desliga animações e decorações.
- Imagens WebP responsivas com `srcset`, dimensões reservadas e carregamento tardio fora da primeira dobra.
- Fontes auto-hospedadas (Fraunces e Plus Jakarta Sans via Fontsource), sem chamadas a serviços externos.

## Avisos

- Horários e alturas de maré são **referências fornecidas pelo viajante** — confira a tábua de marés oficial.
- Passeios às piscinas naturais dependem das condições do mar, da maré e da operação local.
- O mapa é **esquemático**: posições aproximadas; a linha pontilhada mostra a ordem das visitas, não as estradas.

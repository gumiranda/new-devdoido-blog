// RT-One Uberlândia — content for the longread report at /relatorio/rt-one-uberlandia
// Ported verbatim from the design bundle (data.js, data-extra.js, data-impacts.js).

export type Stat = {
  label: string;
  value: string;
  unit?: string;
  sup?: string;
  caption: string;
  alert?: boolean;
};

export type Paragraph = { text: string; dropcap?: boolean };

export type TableRow = { label: string; v: number; unit: string; note: string };

export type Quote = { text: string; who: string };

export type Callout = { label: string; text: string };

export type ImpactItem = {
  n: string;
  kicker: string;
  headline: string;
  lead: string;
  mechanism: string;
  evidence: string;
  source: string;
  decibels?: { label: string; db: number; kind: 'ref' | 'limit' | 'site' }[];
  bars?: { label: string; v: number; max: number; unit: string; note: string }[];
  ladder?: { label: string; pct: number; note: string }[];
  meta?: { lbl: string; v: string }[];
};

export type LicenseCard = { code: string; name: string; status: string; body: string };

export type TimelineEntry = { date: string; title: string; source: string; body: string };

export type ProfileCell = { lbl: string; ttl: string; body: string };

export type Voice = { who: string; role: string; q: string };

export type NationalRow = {
  proj: string;
  sub: string;
  mw: string;
  water: string;
  licensing: string;
  pill: { kind: 'bad' | 'warn' | 'ok' | 'neutral'; label: string };
  href?: string;
};

export type Recommendation = { n: string; ttl: string; body: string; horizon: string };

export type Caveat = { ttl: string; body: string };

export type Faq = { q: string; a: string };

export const RTO_TLDR =
  'A RT-One anunciou um data center de IA em Uberlândia (MG) com investimento de R$ 6 bilhões, capacidade de 100 a 400 MW, consumo aprovado de 2,77 L/s de água potável e 1 km² de terreno na rodovia MGC-497. Até maio de 2026 nenhuma licença ambiental (LP, LI ou LO) foi emitida pela Semad/FEAM-MG; o MPF instaurou inquérito civil para apurar possíveis danos ambientais.';

export const RTO_FAQ: Faq[] = [
  {
    q: 'O que é o projeto RT-One em Uberlândia?',
    a: 'É um data center de inteligência artificial anunciado pela RT-One para a rodovia MGC-497, em zona rural de Uberlândia (MG), com investimento de R$ 6 bilhões, capacidade inicial de 100 MW expansível a 400 MW e terreno de 1 milhão de m².',
  },
  {
    q: 'Quanto de água o data center da RT-One vai consumir?',
    a: 'A RT-One solicitou ao DMAE 2,77 L/s — equivalente a 239,3 mil litros por dia — apenas para a primeira fase de 100 MW. O parecer técnico foi aprovado em fevereiro de 2026. A conta não inclui a água embarcada na geração elétrica nem cenários de captação subterrânea.',
  },
  {
    q: 'Quantas licenças ambientais o data center da RT-One já tem?',
    a: 'Nenhuma. Até 9 de maio de 2026 não há Licença Prévia (LP), Licença de Instalação (LI) nem Licença de Operação (LO) emitidas pela Semad/FEAM-MG. O projeto encontra-se em fase de pré-licenciamento.',
  },
  {
    q: 'Por que o MPF abriu inquérito contra a RT-One?',
    a: 'O Ministério Público Federal em Uberlândia instaurou inquérito civil em março de 2026 para apurar possíveis danos ambientais relacionados ao consumo de água e energia do empreendimento, conforme reportagem da Aos Fatos. A Cemig respondeu ao MPF reconhecendo viabilidade regional, mas alertando que “desabastecimento em nível nacional não é de sua responsabilidade”.',
  },
  {
    q: 'O data center da RT-One vai usar água do Aquífero Guarani?',
    a: 'No projeto irmão em Maringá (PR), a RT-One admitiu publicamente a possibilidade de captação subterrânea do Aquífero Guarani. Em Uberlândia o cenário não foi formalmente descartado nos documentos públicos. Qualquer captação subterrânea dependeria de outorga do IGAM-MG.',
  },
  {
    q: 'Quantas residências equivalem ao consumo de energia da RT-One?',
    a: 'A 400 MW de capacidade contratada operando 24 horas, o data center consumiria cerca de 9,6 GWh por dia — equivalente ao consumo elétrico de aproximadamente 1,6 milhão de residências brasileiras (a 6 kWh/dia por casa, média EPE).',
  },
  {
    q: 'Quem é a RT-One?',
    a: 'A RT-One foi registrada em dezembro de 2024 em São Paulo, sem operações prévias declaradas no setor de data centers. O CEO Fernando Palamone foi falsamente apresentado como COO/VP da Intel em 2024 — a Intel emitiu nota oficial negando o cargo. A empresa anunciou rodada de R$ 15 bilhões liderada pela Hitachi para três empreendimentos.',
  },
  {
    q: 'Quando foi a audiência pública do data center em Uberlândia?',
    a: 'A audiência pública ocorreu em 26 de março de 2026 na Câmara Municipal de Uberlândia, das 19h às 21h. Vereadores, pesquisadores da UFU, Pastoral da Terra e movimentos sociais pediram estudos completos. O presidente da RT-One e a Prefeitura não compareceram; a empresa enviou apenas o advogado Dr. Danilo.',
  },
];

export const RTO_DATA = {
  publication: {
    title: 'Data Center Uberlândia',
    edition: 'Edição nº 7 — Maio de 2026',
    issued: '09.05.2026',
    section: 'Relatório especial / Monitoramento ambiental',
  },

  hero: {
    kicker: 'RT-ONE • UBERLÂNDIA, MG • 1 000 000 m²',
    headlinePre: 'Anatomia de um data center',
    headlineItalic: 'que ainda não existe',
    dek: 'Seis bilhões de reais, quatrocentos megawatts e zero licença ambiental. Como o maior projeto de IA da América Latina foi anunciado no Triângulo Mineiro — e por que MPF, Câmara Municipal e pesquisadores da UFU estão pedindo para parar e olhar.',
    byline: [
      { label: 'Investimento', value: 'R$ 6 bi' },
      { label: 'Capacidade', value: '100 → 400 MW' },
      { label: 'Terreno', value: '1 km², MGC-497' },
      { label: 'Status', value: 'Pré-licenciamento' },
    ],
  },

  stats: [
    { label: 'Água potável solicitada', value: '2,77', unit: 'L/s', caption: '239,3 mil litros/dia ao DMAE — fase 1 (100 MW).' },
    { label: 'Capacidade contratada', value: '100', sup: '→400 MW', caption: 'Subestação Cemig dedicada em negociação final.' },
    { label: 'Equivalência residencial', value: '1,6 mi', caption: 'Casas brasileiras a 400 MW em 24h (G1, Brasil247, 2025).' },
    { label: 'Investimento anunciado', value: 'R$ 6 bi', caption: 'US$ 1,2 bi. Rodada de R$ 15 bi liderada pela Hitachi.' },
    { label: 'Licenças ambientais', value: '0', alert: true, caption: 'Sem LP, LI ou LO na Semad/FEAM-MG até 09.05.2026.' },
  ] satisfies Stat[],

  water: {
    tag: 'I — Água',
    title: 'Pouca água, no papel.',
    lead: 'Em termos absolutos, 2,77 L/s não chega a entrar entre os dez maiores consumidores da cidade. Em termos sistêmicos, é exatamente esse tipo de cálculo restritivo que críticos do projeto contestam.',
    paragraphs: [
      { dropcap: true, text: '<strong>O DMAE</strong> aprovou em fevereiro a viabilidade do fornecimento de 239,3 mil litros de água potável por dia para o data center. O parecer técnico afirma que o pedido “não trará impacto na produção de água tratada da cidade” e cita a presença de várias indústrias multinacionais no município como referência. O prefeito Paulo Sérgio (PP) resumiu em 23/02/2026: o consumo será menor do que o de um conjunto habitacional de 300 casas.' },
      { text: 'A conta, contudo, abrange apenas a <strong>primeira fase</strong> do empreendimento — 100 MW dos 400 MW projetados — e considera <strong>apenas a água potável da rede pública</strong>. Não inclui a água embarcada na geração elétrica nem o cenário admitido pela própria empresa no projeto irmão de Maringá (PR): captação subterrânea para refrigeração, incluindo o <strong>Aquífero Guarani</strong>, com retorno do líquido via trocadores de calor.' },
      { text: 'Em Uberlândia, o predomínio é do Aquífero Bauru, com poços entre 100 e 300 metros, segundo estudos da UFU. Nas peças públicas obtidas, o cenário de captação direta não foi formalmente descartado. A Comissão de Direitos Humanos da Câmara registrou, em ata da audiência pública de 26/03/2026, a preocupação de que “todo o aquífero poderá ser afetado”.' },
    ] satisfies Paragraph[],
    quote: {
      text: 'Em um cenário de intensificação das mudanças climáticas, com maior frequência de secas severas e eventos climáticos extremos, a presença de consumidores intensivos de água pode agravar pressões já existentes sobre os recursos hídricos.',
      who: 'Daniel Caixeta Andrade — Instituto de Economia / UFU',
    } satisfies Quote,
    table: [
      { label: 'Vazão solicitada — data center', v: 2.77, unit: 'L/s', note: 'DMAE, fev/2026' },
      { label: 'Capacidade conjunta das 3 ETAs', v: 2600, unit: 'L/s', note: 'Sucupira + Bom Jardim + Capim Branco' },
      { label: 'Consumo per capita médio', v: 259, unit: 'L/hab/dia', note: 'Sinisa, Uberlândia' },
      { label: 'Pico per capita 2023', v: 320.4, unit: 'L/hab/dia', note: 'verão, capacidade no limite' },
      { label: 'Conjunto habitacional (300 casas)', v: 1.9, unit: 'L/s', note: 'comparativo da prefeitura' },
    ] satisfies TableRow[],
    callout: {
      label: 'Alerta',
      text: 'A RT-One <strong>admitiu publicamente em Maringá</strong> a possibilidade de captar água do Aquífero Guarani. Em Uberlândia, o cenário não foi formalmente descartado — qualquer captação subterrânea dependeria de outorga do IGAM-MG.',
    } satisfies Callout,
  },

  energy: {
    tag: 'II — Energia',
    title: 'Quatro megawatts, 1,6 milhão de casas.',
    lead: 'Cem megawatts de demanda inicial. Quatrocentos, no horizonte. A Cemig diz que o sistema regional comporta — mas avisa que “desabastecimento em nível nacional não é de sua responsabilidade”.',
    paragraphs: [
      { text: 'A 400 MW operando vinte e quatro horas, o data center da RT-One consumiria cerca de <strong>9,6 GWh por dia</strong>. É o equivalente, segundo levantamentos do G1, Brasil247 e Correio Braziliense, ao consumo elétrico de <strong>1,6 milhão de residências brasileiras</strong>. Para referência local: o setor industrial inteiro de Uberlândia consumiu 547 808 MWh em 2020.' },
      { text: 'Em resposta ao inquérito civil do MPF, a Cemig concluiu que “o sistema elétrico regional apresenta condições técnicas adequadas para absorver a carga adicional solicitada, sem comprometer a qualidade e a continuidade do fornecimento local e regional”. Ressalvou, porém, que “o impacto de desabastecimento energético ou hídrico em nível nacional não é de sua responsabilidade”.' },
      { text: 'A RT-One declara que o portfólio será “100% energia renovável”, combinando hidrelétrica, solar e “potencial de hidrogênio verde”. Em Uberlândia, a injeção é via Sistema Interligado Nacional pela Cemig — sem dedicação a uma fonte específica de geração. Até esta data, não há autorização específica do ONS para o empreendimento.' },
    ] satisfies Paragraph[],
  },

  impacts: {
    tag: 'III — Impactos no entorno',
    title: 'O que chega à casa de quem mora ao lado.',
    lead: 'A cerca do canteiro tem 1 km de lado. Mas o que sai dela — ruído, partículas, demanda hídrica, despacho elétrico — atravessa o muro. Cinco caminhos pelos quais o data center entra na vida de quem mora em Pequis, Monte Hebrom e Chácaras Douradinho.',
    neighborhoods: [
      { name: 'Pequis', note: 'rota MGC-497, sentido Prata' },
      { name: 'Monte Hebrom', note: 'comunidade rural — restrição hídrica registrada' },
      { name: 'Chácaras Douradinho', note: 'consulta prévia (Conv. 169 OIT) reivindicada' },
    ],
    items: [
      {
        n: '01',
        kicker: 'Ruído',
        headline: 'Chillers e geradores não dormem.',
        lead: 'Um campus de data center opera vinte e quatro horas, sete dias por semana. As fontes de ruído não desligam.',
        decibels: [
          { label: 'Cerrado rural (referência)', db: 30, kind: 'ref' },
          { label: 'OMS — limite noturno residencial', db: 45, kind: 'limit' },
          { label: 'OMS — limite diurno residencial', db: 55, kind: 'limit' },
          { label: 'Perímetro do campus (estimativa)', db: 67, kind: 'site' },
          { label: 'Próximo a chillers e transformadores', db: 88, kind: 'site' },
          { label: 'Geradores a diesel (back-up)', db: 95, kind: 'site' },
        ],
        mechanism: 'Sistemas de refrigeração líquida, transformadores de alta tensão e geradores de back-up emitem ruído contínuo de baixa frequência. Em zona rural, com baseline ambiental próximo a 30 dB, o contraste subjetivo é maior do que sugerem os números absolutos — propaga-se a centenas de metros.',
        evidence: 'Levantado na audiência pública por Luana Leite Guimarães Santos (CRBio-04), que invocou o Princípio da Precaução da Política Nacional do Meio Ambiente. Sem estudo de impacto acústico publicado pela empresa.',
        source: 'Audiência pública 26.03.2026 · CRBio-04 · OMS',
      },
      {
        n: '02',
        kicker: 'Torneira',
        headline: 'Sedimento, gosto, cor — quando o tratamento opera no limite.',
        lead: 'A vazão pedida pelo data center é pequena no agregado. Mas a água da rede já vinha estressada antes do projeto.',
        bars: [
          { label: 'Capacidade conjunta das 3 ETAs', v: 2600, max: 4000, unit: 'L/s', note: 'Sucupira + Bom Jardim + Capim Branco — pode escalar a 4 000 L/s' },
          { label: 'Consumo per capita médio (Sinisa)', v: 259, max: 350, unit: 'L/hab/dia', note: 'baseline operacional' },
          { label: 'Pico recorde 2023', v: 320.4, max: 350, unit: 'L/hab/dia', note: 'verão, capacidade no limite' },
          { label: 'Pico fim-de-semana ago/2025', v: 300, max: 350, unit: 'L/hab/dia', note: 'ETAs operando próximas do teto' },
        ],
        mechanism: 'Quando as ETAs operam mais próximas do limite — picos de verão, estiagem, novo consumidor pesado — o tempo de retenção e a velocidade de filtração caem. Turbidez residual sobe; cor aparente, gosto metálico e sedimento aparecem na torneira. É o sinal operacional de que o sistema está sob pressão.',
        evidence: 'Uberlândia caiu 10 posições no Ranking do Saneamento 2026 do Instituto Trata Brasil — da 11ª para a 21ª, pior resultado da série histórica. Investimento de R$ 69,89/hab vs. R$ 225/hab recomendados pelo Plansab. Bairros do entorno já enfrentam restrições.',
        source: 'Trata Brasil 2026 · Plansab · DMAE · audiência pública',
      },
      {
        n: '03',
        kicker: 'Conta de luz',
        headline: 'A bandeira sobe para todo mundo.',
        lead: 'A Cemig confirma viabilidade regional. Mas reconhece, por escrito ao MPF, que “desabastecimento em nível nacional não é de sua responsabilidade”.',
        ladder: [
          { label: 'Verde', pct: 0, note: 'Hidrelétricas com reservatórios cheios — sem encargo.' },
          { label: 'Amarela', pct: 25, note: 'Despacho térmico moderado — encargo por 100 kWh.' },
          { label: 'Vermelha I', pct: 60, note: 'Térmica adicional — encargo dobrado.' },
          { label: 'Vermelha II', pct: 100, note: 'Cenário de estiagem severa — térmica intensa, encargo máximo.' },
        ],
        mechanism: 'Cada novo consumidor pesado conectado ao SIN, especialmente em ano seco, força mais despacho termelétrico para fechar o balanço. O custo marginal de geração sobe, o PLD nacional sobe, a bandeira tarifária acompanha. O efeito não é só sobre Uberlândia — chega à conta de qualquer endereço atendido pelo sistema.',
        evidence: 'Resposta da Cemig ao inquérito civil do MPF reconhece o risco. Jornal O Futuro (PCBR, 18.04.2026) destacou a frase como concessão tácita de risco sistêmico.',
        source: 'Cemig · MPF · Jornal O Futuro · ANEEL/ONS (estudos pendentes)',
      },
      {
        n: '04',
        kicker: 'Obra & ar',
        headline: '245 mil m² de construção, módulo por módulo.',
        lead: 'O modelo modular significa obra contínua por anos. Caminhões na MGC-497, poeira de Cerrado, iluminação 24 h.',
        meta: [
          { lbl: 'Edificado', v: '245 000 m²' },
          { lbl: 'Por módulo', v: '12 meses' },
          { lbl: 'Campus total', v: '630 000 m²' },
          { lbl: 'APP declarada', v: '300 000 m²' },
        ],
        mechanism: 'Movimentação de terra e tráfego de caminhões em estrada rural levantam material particulado fino. Iluminação operacional permanente altera o céu noturno e o ciclo da fauna do Cerrado. Resíduos eletrônicos da operação não têm plano público de gerenciamento.',
        evidence: 'Cronograma anunciado: início de obras previsto para maio/2026, cada módulo até 12 meses. Sem plano de gerenciamento de resíduos eletrônicos divulgado.',
        source: 'Comunicação RT-One · prefeitura de Uberlândia · lacunas de informação reportadas pela Aos Fatos',
      },
      {
        n: '05',
        kicker: 'Direito',
        headline: 'Consulta prévia, livre e informada — que não houve.',
        lead: 'Convenção 169 da OIT garante a comunidades afetadas o direito a serem consultadas. As de Chácaras Douradinho dizem que não foram.',
        mechanism: 'A Convenção 169 da OIT — ratificada pelo Brasil — exige consulta prévia, livre e informada a populações tradicionais e comunidades locais sobre empreendimentos que as afetem. O cumprimento é condição de legitimidade, não etapa burocrática.',
        evidence: 'Ser Rio (Comunidade Somos Rio) invocou expressamente a Convenção 169 na audiência pública de 26.03.2026, alegando direito à consulta prévia das comunidades de Chácaras Douradinho. Sem registro público de processo de consulta conduzido pela empresa ou pelo município.',
        source: 'Convenção 169 OIT · Movimento Somos Rio · audiência pública',
      },
    ] satisfies ImpactItem[],
  },

  licensing: {
    tag: 'III — Licenciamento',
    title: 'Três licenças. Nenhuma emitida.',
    lead: 'Pelo porte, o caminho técnico mais provável é o EIA/RIMA com audiência pública estadual. A modalidade ainda não foi definida pela Semad/FEAM-MG.',
    cards: [
      { code: 'LP', name: 'Licença Prévia', status: 'Não emitida', body: 'Aprovaria a localização e a concepção do empreendimento, atestando viabilidade ambiental e estabelecendo requisitos básicos. Cabe à FEAM/Semad, com possível EIA/RIMA.' },
      { code: 'LI', name: 'Licença de Instalação', status: 'Não emitida', body: 'Autorizaria o início das obras conforme o projeto aprovado, incluindo medidas de controle ambiental. Sem LP prévia, não há LI.' },
      { code: 'LO', name: 'Licença de Operação', status: 'Não emitida', body: 'Permitiria o início efetivo das atividades, após verificação do cumprimento das condicionantes. A meta de início de obras em maio/2026 depende do trinômio LP→LI.' },
    ] satisfies LicenseCard[],
    callout: {
      label: 'Risco regulatório',
      text: 'Em Caucaia (CE), o data center do TikTok foi licenciado por <strong>RAS — Relatório Ambiental Simplificado</strong>, caminho considerado pelo MPF-CE “inadequado, insuficiente e inadmissível” para empreendimentos desta escala. A jurisprudência pode ser invocada em Minas Gerais.',
    } satisfies Callout,
  },

  timeline: [
    { date: 'Dez/2024', title: 'RT-One é registrada', source: 'Junta Comercial SP', body: 'Empresa registrada na Vila Ipojuca (SP), mesmo endereço onde funcionava até 2021 a importadora Gamernuc, da qual Fernando Palamone era sócio-administrador. Sem operações prévias declaradas no setor de data centers.' },
    { date: 'Jan/2025', title: 'Anúncio em Maringá (PR)', source: 'Imprensa local', body: 'Primeiro projeto da RT-One, R$ 6 bilhões. Empresa cita conexão direta à linha Itaipu–Sarandi e admite captação do Aquífero Guarani via trocadores de calor.' },
    { date: 'Ago/2024', title: 'Caso Intel', source: 'Aos Fatos, mar/2026', body: 'Fernando Palamone é apresentado como “COO/VP da Intel” ao assinar carta de intenções com o DF. A Intel nega: “Ele não é COO da Intel Corporation e nunca ocupou esse cargo” e toma medidas legais.' },
    { date: '08.07.2025', title: 'Anúncio em Uberlândia', source: 'Prefeitura Municipal', body: 'R$ 6 bilhões, 100→400 MW, terreno de 1 milhão de m² na MGC-497, sentido Prata. Promessa de 2 000 empregos permanentes. Apresentação como “maior data center de IA da América Latina”.' },
    { date: '09.09.2025', title: 'Aquisição do terreno', source: 'Cerimônia oficial', body: 'Aquisição oficializada com presença do prefeito Paulo Sérgio, vice-prefeito Vanderley Pelizer, secretário Fabiano Alves e parceiros (Hitachi, WEG, Siemens, Vertiv).' },
    { date: '20.02.2026', title: 'Projeto arquitetônico', source: 'Comunicação RT-One', body: 'Apresentação ao Município em modelo modular: 245 000 m² edificados, 300 000 m² declarados como Área de Preservação Permanente, cada módulo até 12 meses de obra.' },
    { date: '23.02.2026', title: 'Coletiva FIEMG–Prefeitura', source: 'Belo Horizonte', body: 'Cemig confirma viabilidade dos 100 MW. DMAE aprova 2,77 L/s. Prefeito Paulo Sérgio: “Consumirá menos do que um conjunto habitacional de 300 casas”.' },
    { date: '24.02.2026', title: 'Câmara abre o tema', source: 'Comissão de Direitos Humanos', body: 'Reunião com a Faculdade de Direito da UFU sobre “Sustentabilidade em Data Centers”, conduzida pela vereadora Amanda Gondim (PSB), relatora do marco normativo municipal.' },
    { date: '17.03.2026', title: 'Inquérito civil do MPF', source: 'Aos Fatos — Luiz Fernando Menezes', body: 'Reportagem revela inquérito civil instaurado pelo Ministério Público Federal em Uberlândia para apurar possíveis danos ambientais. Não há resposta da RT-One nos documentos públicos do inquérito.' },
    { date: '18.03.2026', title: 'Trata Brasil 2026', source: 'Instituto Trata Brasil', body: 'Uberlândia cai 10 posições no Ranking do Saneamento, da 11ª para a 21ª — pior resultado da série histórica. Investimento de R$ 69,89/hab vs. R$ 225/hab recomendados pelo Plansab.' },
    { date: '26.03.2026', title: 'Audiência pública', source: 'Câmara Municipal', body: 'Das 19h às 21h. Vereadora Amanda Gondim (PSB) sintetiza: “não existe Data Center sustentável”. Prefeitura e presidente da RT-One ausentes; a empresa envia apenas um advogado.' },
    { date: 'Mai/2026', title: 'Protocolo aguardado', source: 'Semad/FEAM-MG', body: 'Aguarda-se o protocolo do FCEI/FOB no SIAM-MG. A definição da modalidade (LAS-RAS, trifásico ou concomitante) determinará o nível de exigência.' },
  ] satisfies TimelineEntry[],
};

export const RTO_DATA_EXTRA = {
  profile: {
    tag: 'V — A empresa',
    title: 'Uma “multinacional norte-americana” registrada em dezembro.',
    lead: 'Sem operações prévias comprovadas no setor. Um CEO associado pela Intel ao uso indevido de seu nome. R$ 6 bilhões prometidos.',
    cells: [
      {
        lbl: 'Constituição',
        ttl: 'Dezembro de 2024',
        body: 'Registrada em <strong>São Paulo, Vila Ipojuca</strong>, no mesmo endereço onde, até 2021, funcionava a importadora de eletrônicos <strong>Gamernuc</strong>, da qual Fernando Palamone era sócio-administrador. O site oficial lista apenas dois empreendimentos, ambos em construção: Uberlândia e Maringá.',
      },
      {
        lbl: 'CEO',
        ttl: 'Fernando Palamone',
        body: 'Residente nos EUA há quase três décadas, com histórico declarado em <strong>IBM, Cisco, Citrix, PDF Solutions e Intel</strong>. Em agosto de 2024, foi falsamente representado como COO/VP da Intel ao assinar carta de intenções com o governo do Distrito Federal. A Intel: “ele não é COO da Intel Corporation e nunca ocupou esse cargo”.',
      },
      {
        lbl: 'Captação',
        ttl: 'R$ 15 bi (dez/2025)',
        body: 'Rodada anunciada para três empreendimentos — Uberlândia, Maringá e um terceiro a definir — liderada pela <strong>Hitachi</strong>. Os demais investidores da rodada não foram revelados publicamente.',
      },
      {
        lbl: 'Parceiros listados',
        ttl: '12 nomes',
        body: 'Hitachi, WEG, Siemens, Vertiv, Schneider Electric, Engemon Construtora, Multiway Infra, Munters, Supermicro, Endor Development, LZA e <strong>Universidade de Uberaba (Uniube)</strong>.',
      },
    ] satisfies ProfileCell[],
  },

  hearing: {
    tag: 'VI — Audiência pública 26.03.2026',
    title: 'Quem falou. Quem não veio.',
    lead: 'Em duas horas de Câmara Municipal, vereadores, pesquisadores da UFU, Pastoral da Terra, Conselho de Biologia e movimentos populares pediram estudos completos. A RT-One enviou um advogado.',
    voices: [
      { who: 'Vereadora Amanda Gondim (PSB)', role: 'Relatora do marco normativo municipal', q: 'Não existe Data Center sustentável.' },
      { who: 'Vereador Dr. Igino (PT)', role: 'Defendeu redirecionamento do empreendimento', q: '100 mil pessoas moram em áreas irregulares, sem acesso a água, energia e saneamento básico. Como serão direcionados esses recursos para o Data Center?' },
      { who: 'Profª Drª Naiara Aparecida Lima Vilela', role: 'Faculdade de Direito da UFU', q: 'É preciso considerar a questão ambiental para as presentes e futuras gerações — não cabe à Prefeitura tomar a defesa sem estudo de impactos.' },
      { who: 'Luana Leite Guimarães Santos', role: 'Conselho Regional de Biologia — 4ª Região', q: 'Poluição sonora, alto consumo elétrico-hídrico e crise hídrica do Triângulo Mineiro. Invoco o Princípio da Precaução da Política Nacional do Meio Ambiente.' },
      { who: 'Frei Rodrigo', role: 'Pastoral da Terra / CNBB', q: 'Estudos completos e independentes. Não cabe à Prefeitura tomar a defesa do empreendimento.' },
      { who: 'Lucas Bacelar', role: 'Movimentos populares', q: 'Repúdio à instalação de Data Centers em cidades brasileiras, que servem a favor de uma elite estrangeira.' },
    ] satisfies Voice[],
    absent: [
      'Presidente da RT-One',
      'Prefeito Paulo Sérgio (PP)',
      'Secretários municipais convidados',
      'Governador Mateus Simões (Novo)',
    ],
  },

  national: {
    tag: 'VII — Mapa nacional',
    title: 'Quatro projetos. Quatro modelos de risco.',
    lead: 'A RT-One Uberlândia não é caso isolado. É parte de uma corrida que envolve modelos de licenciamento ainda em disputa.',
    rows: [
      { proj: 'RT-One Uberlândia (MG)', sub: 'MGC-497 — rural', mw: '100 → 400 MW', water: '239,3 mil L/dia', licensing: 'Em pré-licenciamento (Semad/FEAM-MG)', pill: { kind: 'bad', label: 'Inquérito MPF' }, href: '/diretorio/rt-one-uberlandia' },
      { proj: 'RT-One Maringá (PR)', sub: 'Empreendimento gêmeo', mw: '400 MW', water: 'Admite Aquífero Guarani', licensing: 'ZPE federal pendente', pill: { kind: 'bad', label: 'Inquérito MPF-PR' }, href: '/diretorio/rt-one-maringa' },
      { proj: 'TikTok / Casa dos Ventos / Pátria', sub: 'Caucaia — CE', mw: '210 → 576 MW', water: '30 → 144 mil L/dia (revisado 7,3×)', licensing: 'RAS — laudo PGR: “inadmissível”', pill: { kind: 'bad', label: 'Funai pediu suspensão' }, href: '/diretorio/tiktok-caucaia' },
      { proj: 'Scala AI City', sub: 'Eldorado do Sul — RS', mw: '1 800 → 5 000 MW', water: 'Refrigeração a óleo', licensing: 'Em licenciamento', pill: { kind: 'warn', label: 'ONS aprovou rede básica' }, href: '/diretorio/scala-ai-city' },
      { proj: 'Rio AI City (Elea)', sub: 'Jacarepaguá — RJ', mw: '1 500 → 3 200 MW', water: 'Não divulgado', licensing: 'Apoio federal e estadual', pill: { kind: 'neutral', label: 'Em estruturação' }, href: '/diretorio/elea-jacarepagua' },
    ] satisfies NationalRow[],
  },

  recommendations: {
    tag: 'VIII — O que monitorar',
    title: 'Cinco pontos de vigilância.',
    lead: 'Sintetizado a partir das recomendações ao cidadão, jornalista e pesquisador acompanhando o caso.',
    items: [
      { n: '01', ttl: 'Modalidade de licenciamento no SIAM-MG', body: 'Monitorar o protocolo do FCEI/FOB na Semad/FEAM. Se enquadrado como LAS-RAS (rito simplificado), exigir reenquadramento para EIA/RIMA. A jurisprudência do laudo da PGR no caso Caucaia é precedente direto.', horizon: 'Próximas 8 semanas' },
      { n: '02', ttl: 'Marco normativo municipal', body: 'Acompanhar o projeto de lei da Fadir/UFU na Câmara, exigindo WUE máximo obrigatório, PUE auditado, relatório mensal público de consumo e contrapartidas locais cláusula a cláusula.', horizon: 'Médio prazo' },
      { n: '03', ttl: 'Inclusão obrigatória do IGAM-MG', body: 'Pressionar pela inclusão obrigatória do IGAM no licenciamento integrado, com posição pública sobre eventual captação subterrânea em Aquífero Bauru ou Guarani — deliberação CERH-MG nº 49/2015 aplica-se.', horizon: 'Médio prazo' },
      { n: '04', ttl: 'Estudos de fluxo de potência (ANEEL/ONS)', body: 'Solicitar divulgação dos estudos para os 100 MW adicionais e efeitos sobre bandeiras tarifárias locais — especialmente em períodos de estiagem com despacho termelétrico.', horizon: 'Médio prazo' },
      { n: '05', ttl: 'Moratória regional no Triângulo Mineiro', body: 'Pressionar Câmara e ALMG por moratória sobre licenciamentos de data centers até existir estudo cumulativo regional (RT-One Uberlândia + Maringá + Alibaba Cloud + outros) — para criar regras, não para flexibilizar.', horizon: 'Longo prazo' },
    ] satisfies Recommendation[],
  },

  caveats: {
    tag: 'IX — Caveats',
    title: 'O que ainda não sabemos.',
    items: [
      { ttl: 'Número do inquérito civil do MPF', body: 'Não consta nas peças jornalísticas consultadas (Aos Fatos cita apenas “o procurador” sem identificação).' },
      { ttl: 'Parecer integral do DMAE', body: 'Não há disponibilização pública do parecer técnico, nem do estudo conjunto Cemig–RT-One sobre os 100 MW.' },
      { ttl: 'Posição do MPMG', body: 'Até esta data, não há registro público de procedimento estadual instaurado pelo Ministério Público de Minas Gerais.' },
      { ttl: 'Investidores da rodada Hitachi', body: 'Apenas o líder da rodada de R$ 15 bilhões foi revelado. Os demais participantes permanecem indisclosed.' },
      { ttl: 'Contrato de cliente-âncora', body: 'Não há disponibilização pública de contratos com cliente-âncora estrangeiro ou modelo de produção (ACR/ACL, ZPE).' },
      { ttl: 'Subestação dedicada — local', body: 'A localização exata da subestação Cemig dedicada não foi divulgada nas peças oficiais.' },
    ] satisfies Caveat[],
  },

  sources: [
    'Aos Fatos — Luiz Fernando Menezes, 17/03/2026',
    'Jornal O Futuro / PCBR — 18/04/2026',
    'Câmara Municipal de Uberlândia — “O Legislativo”, edição 4068, 09/04/2026',
    'Cemig — Resposta ao inquérito civil do MPF',
    'DMAE — Parecer técnico, fev/2026',
    'Instituto Trata Brasil — Ranking do Saneamento 2026',
    'Mobile Time — 27/02/2026',
    'EPE — Boletim mensal, mar/2025',
    'Sinisa — Sistema Nacional de Informações sobre Saneamento',
  ],
};

export const ptBR = {
  common: {
    loading: "Carregando…",
    loadError: "Falha ao carregar dados: {{error}}",
  },
  nav: {
    compare: "Comparar",
    library: "Biblioteca",
    about: "Sobre",
    primary: "Principal",
    lang: "Trocar idioma",
  },
  footer: {
    source:
      "Respostas de frequência obtidas ao vivo dos revisores do squig.link",
    tagline: "Lembre-se: ouça música, não o equipamento que está usando",
  },
  compare: {
    title: "Comparar",
    subtitle:
      "Visualize respostas de frequência de fones intra-auriculares contra uma curva de referência",
    deviceLabel: "Dispositivos",
    targetLabel: "Curva alvo",
    regionLabel: "Destacar região",
    zoomInRegionLabel: "Zoom na região de destaque",
    regionPlaceholder: "Nenhuma",
    yNormalized: "Amplitude (dB, normalizada)",
    yRaw: "Amplitude (dB)",
    xRaw: "Frequência (Hz)",
    copyUrl: "Copiar link",
    copyUrlSuccess: "Link copiado!",
  },
  chart: {
    empty: "Selecione ao menos um fone para plotar o gráfico",
  },
  deviceSelector: {
    placeholderGeneric: "Buscar",
    placeholder: "Buscar ({{count}}+ caracteres)…",
    minChars: "Digite ao menos {{count}} caracteres para buscar",
    noResults: 'Nenhum dispositivo corresponde a "{{query}}"',
    refine: "Mostrando os primeiros {{shown}} de {{total}}, refine a busca",
    selected: "{{count}} selecionados",
  },
  library: {
    title: "Biblioteca",
    searchPlaceholder: "Buscar por nome ou marca…",
    measuredBy: "medido por {{reviewer}}",
    loading: "Carregando catálogo…",
    noResults: 'Nenhum resultado para "{{query}}"',
    reviewLink: "Review",
    shopLink: "Comprar",
  },
  detail: {
    back: "Biblioteca",
    openCompare: "Abrir no comparador",
    brand: "Marca",
    source: "Fonte",
    rig: "Rig",
    type: "Tipo",
    deviation: "Curva Harman",
    deviationDesc:
      "Diferença absoluta média em relação à curva alvo Harman 2019 (20 Hz - 10 kHz). Quanto menor, mais próximo do alvo.",
    notFound: "Esse fone não está na biblioteca",
    backToLibrary: "Voltar para a biblioteca",
    noDeviation: "Sem desvio de curva alvo atual",
  },
  ranges: {
    "sub-bass": "Sub-graves",
    "mid-bass": "Graves médios",
    "lower-mid": "Médios inferiores",
    "upper-mid": "Médios superiores (sensação de claridade)",
    presence: "Presença",
    "mid-treble": "Agudos médios (causadores da sensação de fadiga)",
    air: "Agudos superiores (ar)",
  },
  about: {
    title: "Sobre",
    intro:
      "Uma bancada escura para comparar respostas de frequência de fones intra-auriculares.",
    dataTitle: "Dados",
    dataBody:
      "Todos os dados de resposta de frequência são obtidos ao vivo do ecossistema de revisores do <squig>squig.link</squig>. O aplicativo faz engenharia reversa da API interna do squig.link — carregando o catálogo de revisores, os phone books individuais e os arquivos de medição brutos sob demanda, sem assets estáticos nem pipeline de dados manual.",
    methodTitle: "Método",
    methodBody1:
      "Todas as curvas são medições cruas em acopladores IEC 60318-4 (GRAS RA0045 ou estilo 711), plotadas em eixo de frequência logarítmico de 20 Hz a 20 kHz. A normalização desloca cada curva para 0 dB em 1 kHz, que é como o squig.link compara tonalidade relativa; SPL absoluto não é exibido.",
    methodBody2:
      "A linha de referência é o alvo Harman 2019 in-ear. Resposta de frequência não é a história toda: encaixe, vedação, variação de unidade e diferenças de rig movem essas curvas.",
    creditsTitle: "Créditos",
    credits: {
      squig: "banco de medições & fonte de dados principal",
      autoEq: "dados abertos + ferramentas de EQ (MIT)",
      oratory: "medições",
      superReview: "medições",
    },
  },
  onboarding: {
    title: "Bem-vindo ao IEM Graph",
    compare:
      "Compare curvas de resposta de frequência de múltiplos fones lado a lado",
    library:
      "Explore o banco de dados completo do squig.link e veja medições individuais",
    targets:
      "Sobreponha curvas alvo (Harman, DF, etc.) para avaliar tonalidade",
    data: "Todos os dados vêm ao vivo das medições dos revisores do squig.link",
    dismiss: "Entendi",
  },
} as const;

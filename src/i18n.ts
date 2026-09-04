import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  "en-US": {
    translation: {
      common: {
        loading: "Loading…",
        loadError: "Failed to load data: {{error}}",
      },
      nav: {
        compare: "Compare",
        library: "Library",
        about: "About",
        primary: "Primary",
        lang: "Switch language",
      },
      footer: {
        source:
          "Frequency responses from AutoEq, mirrored from squig.link databases",
        tagline: "Remember: listen music, not the equipment you're using",
      },
      compare: {
        title: "Compare",
        subtitle:
          "Visualize IEMs frequency responses against a reference target",
        iemsLabel: "IEMs",
        targetLabel: "Target curve",
        regionLabel: "Highlight region",
        zoomInRegionLabel: "Zoom in Highlight region",
        regionPlaceholder: "None",
        yNormalized: "Amplitude (dB, normalized)",
        yRaw: "Amplitude (dB)",
      },
      chart: {
        empty: "Select at least one IEM to plot the chart",
      },
      multiSelect: {
        none: "None selected",
        all: "All selected",
        count: "{{count}} of {{total}} selected",
      },
      library: {
        title: "Library",
        count: "{{count}} IEMs from the squig.link mirror",
        search: "Search brand or model",
      },
      detail: {
        back: "Library",
        openCompare: "Open in compare",
        brand: "Brand",
        source: "Source",
        rig: "Rig",
        type: "Type",
        deviation: "Harman deviation",
        deviationDesc:
          "Mean absolute difference from the Harman 2019 target (20 Hz - 10 kHz). Lower is closer to the target",
        notFound: "That IEM isn't in the library",
        backToLibrary: "Back to library",
      },
      ranges: {
        "sub-bass": "Sub-bass",
        "mid-bass": "Mid-bass",
        "lower-mid": "Lower midrange",
        "upper-mid": "Upper midrange (clarity feeling)",
        presence: "Presence",
        "mid-treble": "Mid-treble (main cause of auditory fatigue)",
        air: "Upper treble (air)",
      },
      about: {
        title: "About",
        intro:
          "A dark workbench for comparing in-ear monitor frequency responses",
        dataTitle: "Data",
        dataBody:
          "Curves come from the <autoEq>AutoEq</autoEq> project, which mirrors frequency response measurements published across the <squig>squig.link</squig> ecosystem. This build ships a curated snapshot of popular IEMs measured by <oratory>oratory1990</oratory> and <superReview>Super Review</superReview>, regenerated with <code>npm run data</code>.",
        methodTitle: "Method",
        methodBody1:
          "All curves are raw on-ear coupler measurements on IEC 60318-4 rigs (GRAS RA0045 or 711-style), plotted on a logarithmic frequency axis from 20 Hz to 20 kHz. Normalization shifts each curve so it reads 0 dB at 1 kHz, which is how squig.link compares relative tonality; absolute SPL is not shown",
        methodBody2:
          "The reference line is the Harman 2019 in-ear target. A frequency response is not the whole story: fit, seal, unit variation, and rig differences all move these curves.",
        creditsTitle: "Credits",
        credits: {
          squig: "measurement database + graph tool",
          autoEq: "open data + EQ tooling (MIT)",
          oratory: "measurements",
          superReview: "measurements",
        },
      },
    },
  },
  "pt-BR": {
    translation: {
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
        source: "Respostas de frequência do AutoEq, obtidas do squig.link",
        tagline: "Lembre-se: ouça música, não o equipamento que está usando",
      },
      compare: {
        title: "Comparar",
        subtitle:
          "Visualize respostas de frequência de fones intra-auriculares contra uma curva de referência",
        iemsLabel: "IEMs",
        targetLabel: "Curva alvo",
        regionLabel: "Destacar região",
        zoomInRegionLabel: "Zoom na região de destaque",
        regionPlaceholder: "Nenhuma",
        yNormalized: "Amplitude (dB, normalizada)",
        yRaw: "Amplitude (dB)",
      },
      chart: {
        empty: "Selecione ao menos um fone para plotar o gráfico",
      },
      multiSelect: {
        none: "Nenhum selecionado",
        all: "Todos selecionados",
        count: "{{count}} de {{total}} selecionados",
      },
      library: {
        title: "Biblioteca",
        count: "{{count}} IEMs do squig.link",
        search: "Buscar marca ou modelo",
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
          "As curvas vêm do projeto <autoEq>AutoEq</autoEq>, que espelha medições publicadas no ecossistema <squig>squig.link</squig>. Esta build traz um recorte de fones populares medidos por <oratory>oratory1990</oratory> e <superReview>Super Review</superReview>, regenerado com <code>npm run data</code>.",
        methodTitle: "Método",
        methodBody1:
          "Todas as curvas são medições cruas em acopladores IEC 60318-4 (GRAS RA0045 ou estilo 711), plotadas em eixo de frequência logarítmico de 20 Hz a 20 kHz. A normalização desloca cada curva para 0 dB em 1 kHz, que é como o squig.link compara tonalidade relativa; SPL absoluto não é exibido.",
        methodBody2:
          "A linha de referência é o alvo Harman 2019 in-ear. Resposta de frequência não é a história toda: encaixe, vedação, variação de unidade e diferenças de rig movem essas curvas.",
        creditsTitle: "Créditos",
        credits: {
          squig: "banco de medições + ferramenta de gráficos",
          autoEq: "dados abertos + ferramentas de EQ (MIT)",
          oratory: "medições",
          superReview: "medições",
        },
      },
    },
  },
} as const;

const stored = (() => {
  try {
    return localStorage.getItem("lang");
  } catch {
    return null;
  }
})();

const detected =
  typeof navigator !== "undefined" &&
  navigator.language.toLowerCase().startsWith("pt")
    ? "pt-BR"
    : "en-US";

void i18n.use(initReactI18next).init({
  resources,
  lng: stored ?? detected,
  fallbackLng: "en-US",
  interpolation: { escapeValue: false },
});

export default i18n;

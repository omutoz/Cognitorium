import { useState, useEffect } from "react";

const LOGO_SRC = "logo.png";

const themes = {
  light: {
    name: "light",
    bg: "#FAF8F2",
    bgCard: "#F3F0E8",
    bgCardHover: "#EBE8DF",
    text: "#1A1A1A",
    textSecondary: "#555555",
    textMuted: "#888888",
    accent: "#1A1A1A",
    accentLine: "#1A1A1A",
    border: "rgba(26,26,26,0.08)",
    borderStrong: "rgba(26,26,26,0.15)",
    navBg: "#FAF8F2",
    navBorder: "rgba(26,26,26,0.08)",
    tag: "#E4DFD4",
    tagText: "#444444",
    tagActive: "#1A1A1A",
    tagActiveText: "#FAF8F2",
    filterBg: "rgba(26,26,26,0.05)",
    filterBorder: "rgba(26,26,26,0.10)",
    filterActiveBg: "#1A1A1A",
    filterActiveText: "#FAF8F2",
    filterInactiveText: "#555555",
    switchBg: "#1A1A1A",
    switchThumb: "#FAF8F2",
  },
  dark: {
    name: "dark",
    bg: "#1C1C1C",
    bgCard: "#242424",
    bgCardHover: "#2C2C2C",
    text: "#E8E8E8",
    textSecondary: "#AAAAAA",
    textMuted: "#666666",
    accent: "#7DBF82",
    accentLine: "#7DBF82",
    border: "rgba(255,255,255,0.07)",
    borderStrong: "rgba(255,255,255,0.13)",
    navBg: "#181818",
    navBorder: "rgba(255,255,255,0.06)",
    tag: "#424242",
    tagText: "#9DBF82",
    tagActive: "#7DBF82",
    tagActiveText: "#1C1C1C",
    filterBg: "rgba(255,255,255,0.04)",
    filterBorder: "rgba(255,255,255,0.08)",
    filterActiveBg: "#7DBF82",
    filterActiveText: "#1C1C1C",
    filterInactiveText: "#AAAAAA",
    switchBg: "#7DBF82",
    switchThumb: "#1C1C1C",
  },
};

const SOURCE_COLORS = {
  "Anthropic": "#C4552A", "OpenAI": "#10A37F", "Google AI": "#4285F4",
  "Google DeepMind": "#1D9E75", "Meta AI": "#0668E1", "Microsoft AI": "#00A4EF",
  "NVIDIA": "#76B900", "Hugging Face": "#FF9D00", "Mistral AI": "#7C3AED",
  "xAI": "#888888", "ElevenLabs": "#E84393", "Perplexity": "#1FB8CD",
  "Cohere": "#39A28A", "DeepSeek": "#4B6EF5", "AWS ML": "#FF9900",
  "Arena": "#E85D04", "Luma AI": "#9B59B6",
};

const TAGS = ["all", "top labs", "model release", "product", "research", "partnership", "safety", "hardware", "open source", "agents", "tools", "funding"];

const TAG_LABELS = {
  ua: { all: "Всі", "top labs": "топ лаби", "model release": "реліз моделі", product: "продукт", research: "дослідження", partnership: "партнерство", safety: "безпека", hardware: "залізо", "open source": "відкритий код", agents: "агенти", tools: "інструменти", funding: "фінансування" },
  en: { all: "All", "top labs": "top labs", "model release": "model release", product: "product", research: "research", partnership: "partnership", safety: "safety", hardware: "hardware", "open source": "open source", agents: "agents", tools: "tools", funding: "funding" },
};

const i18n = {
  ua: { title: "Новини", subtitle: "Стрічка AI-новин з офіційних джерел", updated: "Оновлено", ago: "годину тому", items: "новин за тиждень", thisWeek: "Цей тиждень", langSwitch: "ENG", themeLight: "Світла", themeDark: "Темна", loadMore: "Завантажити ще тиждень", tagline: "навчайся природно зі штучним інтелектом" },
  en: { title: "News", subtitle: "AI news feed from official sources", updated: "Updated", ago: "hour ago", items: "news this week", thisWeek: "This week", langSwitch: "УКР", themeLight: "Light", themeDark: "Dark", loadMore: "Load previous week", tagline: "learn naturally with artificial intelligence" },
};

const NAV_ITEMS = {
  ua: ["Про нас", "Новини", "Учням", "Студентам", "Вчителям", "Інструменти", "Контекст"],
  en: ["About", "News", "Students", "Uni", "Teachers", "Tools", "Context"],
};

const NEWS = [
  {
    week: "26 травня 2026", week_en: "May 26, 2026", isCurrentWeek: true,
    items: [
      { id: 1, source: "Anthropic", date: "25 травня", date_en: "May 25", tag: "safety", topLab: true, ua: "Кріс Ола у Ватикані: AI має внутрішні стани схожі на радість, страх і горе", en: "Chris Olah at Vatican: AI has internal states resembling joy, fear and grief", desc_ua: "Співзасновник Anthropic закликав громадянське суспільство долучитися до нагляду за розвитком AI. Він відверто визнав що всі frontier-лаби діють під тиском комерційних і геополітичних амбіцій.", desc_en: "Anthropic co-founder urged civil society to join AI oversight efforts, frankly admitting that all frontier labs operate under commercial and geopolitical pressure." },
      { id: 2, source: "OpenAI", date: "24 травня", date_en: "May 24", tag: "model release", topLab: true, ua: "GPT-5.5 тепер доступний у всіх планах включаючи безкоштовний", en: "GPT-5.5 now available across all plans including free tier", desc_ua: "OpenAI розширила доступ до флагманського асистента. Безкоштовні користувачі отримали ліміт 10 запитів на день, Plus і Pro — без обмежень.", desc_en: "OpenAI expanded access to its flagship assistant. Free users get 10 requests per day, Plus and Pro plans are unlimited." },
      { id: 3, source: "Google DeepMind", date: "23 травня", date_en: "May 23", tag: "research", topLab: true, ua: "Gemini for Science: нові інструменти для прискорення наукових відкриттів", en: "Gemini for Science: new tools to accelerate scientific discovery", desc_ua: "Google DeepMind презентував набір інструментів для дослідників у галузях біології, хімії та кліматології. Особливий акцент — на синтезі літератури і генерації гіпотез.", desc_en: "Google DeepMind presented a toolkit for researchers in biology, chemistry and climate science, with emphasis on literature synthesis and hypothesis generation." },
      { id: 4, source: "Anthropic", date: "22 травня", date_en: "May 22", tag: "partnership", topLab: true, ua: "KPMG інтегрує Claude у роботу 276 000 співробітників у стратегічному альянсі", en: "KPMG integrates Claude across 276,000 employees in strategic alliance", desc_ua: "Одна з найбільших аудиторських компаній світу стала партнером Anthropic для трансформації робочих процесів в аудиті, консалтингу та податковому обліку.", desc_en: "One of the world's largest audit firms partnered with Anthropic to transform workflows in audit, consulting and tax services." },
      { id: 5, source: "NVIDIA", date: "22 травня", date_en: "May 22", tag: "hardware", topLab: true, ua: "Blackwell Ultra: нові GPU для inference з підтримкою FP4 і вдвічі вищою пропускною спроможністю", en: "Blackwell Ultra: new inference GPUs with FP4 support and 2x throughput", desc_ua: "NVIDIA анонсувала наступне покоління чіпів для виведення AI-моделей. Підтримка FP4 дозволяє вдвічі збільшити кількість токенів на секунду при тій самій потужності.", desc_en: "NVIDIA announced the next generation of AI inference chips. FP4 support doubles token throughput at the same power consumption." },
      { id: 6, source: "Hugging Face", date: "20 травня", date_en: "May 20", tag: "product", topLab: false, ua: "HF Inference Providers: один API для 50+ моделей від 12 провайдерів", en: "HF Inference Providers: one API for 50+ models from 12 providers", desc_ua: "Hugging Face об'єднав доступ до моделей від Anthropic, Mistral, Cohere та інших через єдиний уніфікований інтерфейс з однаковим форматом запитів.", desc_en: "Hugging Face unified access to models from Anthropic, Mistral, Cohere and others through a single interface with a consistent request format." },
    ]
  },
  {
    week: "19 травня 2026", week_en: "May 19, 2026", isCurrentWeek: false,
    items: [
      { id: 7, source: "Mistral AI", date: "19 травня", date_en: "May 19", tag: "model release", topLab: false, ua: "Devstral 2: open-source модель для агентного кодування (Apache 2.0)", en: "Devstral 2: open-source model for agentic coding (Apache 2.0)", desc_ua: "Mistral AI опублікувала нову кодингову модель з ліцензією Apache 2.0, оптимізовану для автономних агентів що виконують багатокрокові задачі.", desc_en: "Mistral AI released a new coding model under Apache 2.0 license, optimized for autonomous agents handling multi-step tasks." },
      { id: 8, source: "Anthropic", date: "18 травня", date_en: "May 18", tag: "product", topLab: true, ua: "Anthropic придбав Stainless — автоматична генерація SDK для API", en: "Anthropic acquires Stainless — automatic SDK generation for APIs", desc_ua: "Поглинання дозволить Anthropic автоматично генерувати клієнтські бібліотеки для нових версій API на десятках мов програмування.", desc_en: "The acquisition will allow Anthropic to auto-generate client libraries for new API versions across dozens of programming languages." },
      { id: 9, source: "DeepSeek", date: "17 травня", date_en: "May 17", tag: "model release", topLab: false, ua: "DeepSeek V4-Pro: 1.6T параметрів, контекст 1 млн токенів доступний через API", en: "DeepSeek V4-Pro: 1.6T parameters, 1M token context now available via API", desc_ua: "Китайська лабораторія офіційно відкрила API для найпотужнішої моделі. Підтримка контексту в 1 мільйон токенів дозволяє аналізувати цілі кодові бази або книги.", desc_en: "Chinese lab officially opened API for its most powerful model. 1M token context support enables analysis of entire codebases or books." },
      { id: 10, source: "Cohere", date: "16 травня", date_en: "May 16", tag: "product", topLab: false, ua: "Command A Vision: мультимодальна enterprise-модель з підтримкою документів і зображень", en: "Command A Vision: multimodal enterprise model with document and image support", desc_ua: "Cohere додав підтримку зображень і PDF до флагманської enterprise-моделі Command A, зберігши акцент на приватності і розгортанні в корпоративній інфраструктурі.", desc_en: "Cohere added image and PDF support to flagship enterprise model Command A, maintaining focus on privacy and on-premise deployment." },
      { id: 11, source: "Anthropic", date: "14 травня", date_en: "May 14", tag: "partnership", topLab: true, ua: "Anthropic та Gates Foundation: партнерство на $200 млн для глобальної охорони здоров'я", en: "Anthropic and Gates Foundation: $200M partnership for global health", desc_ua: "Фінансування спрямоване на використання Claude у програмах охорони здоров'я, освіти та наукових досліджень на 4 роки. Включає грантове фінансування і кредити Claude.", desc_en: "Funding aimed at using Claude in health, education and research programs over 4 years, including grants and Claude credits." },
    ]
  },
  {
    week: "12 травня 2026", week_en: "May 12, 2026", isCurrentWeek: false,
    items: [
      { id: 12, source: "Luma AI", date: "15 травня", date_en: "May 15", tag: "product", topLab: false, ua: "Ray3.14: генерація відео у нативному 1080p — у 4 рази швидше попередньої версії", en: "Ray3.14: native 1080p video generation — 4x faster than previous version", desc_ua: "Luma AI випустила новий відеогенератор з покращеною стабільністю руху і підтримкою нативного 1080p без upscaling. Генерація 10 секунд відео займає менше хвилини.", desc_en: "Luma AI released new video generator with improved motion stability and native 1080p without upscaling. 10 seconds of video takes under a minute to generate." },
      { id: 13, source: "ElevenLabs", date: "12 травня", date_en: "May 12", tag: "product", topLab: false, ua: "Eleven v3: синтез мовлення з емоційним контролем і підтримкою 32 мов", en: "Eleven v3: speech synthesis with emotion control and 32 language support", desc_ua: "ElevenLabs представив оновлену модель з точним налаштуванням тону, темпу та емоційного забарвлення. Нова архітектура зменшила артефакти при синтезі довгих текстів.", desc_en: "ElevenLabs presented updated model with precise control over tone, pace and emotion. New architecture reduces artifacts in long-form synthesis." },
      { id: 14, source: "AWS ML", date: "9 травня", date_en: "May 9", tag: "model release", topLab: false, ua: "Claude Opus 4.7 доступний в Amazon Bedrock з підтримкою агентів і tool use", en: "Claude Opus 4.7 available in Amazon Bedrock with agent and tool use support", desc_ua: "AWS інтегрував останню модель Anthropic у Bedrock з підтримкою Managed Agents, Knowledge Bases і tool use. Доступний у регіонах US East і EU West.", desc_en: "AWS integrated Anthropic's latest model into Bedrock with Managed Agents, Knowledge Bases and tool use support. Available in US East and EU West regions." },
    ]
  }
];

const TOP_LAB_SOURCES = ["OpenAI", "Anthropic", "Google AI", "Google DeepMind", "Meta AI", "Microsoft AI", "NVIDIA"];

function itemMatchesFilter(item, filter) {
  if (filter === "all") return true;
  if (filter === "top labs") return TOP_LAB_SOURCES.includes(item.source);
  return item.tag === filter;
}

function ThemeSwitch({ theme, onToggle, t }) {
  const isDark = theme === "dark";
  return (
    <button onClick={onToggle} title={isDark ? "Темна тема" : "Світла тема"} style={{ display: "flex", alignItems: "center", background: "none", border: "1px solid " + t.borderStrong, borderRadius: "2rem", padding: "0.3rem 0.45rem", cursor: "pointer", transition: "all 0.25s ease", flexShrink: 0 }}>
      <div style={{ width: "2rem", height: "1.1rem", borderRadius: "1rem", background: t.switchBg, position: "relative", transition: "background 0.3s ease" }}>
        <div style={{ position: "absolute", top: "2px", left: isDark ? "calc(100% - 1rem - 2px)" : "2px", width: "calc(1.1rem - 4px)", height: "calc(1.1rem - 4px)", borderRadius: "50%", background: t.switchThumb, transition: "left 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      </div>
    </button>
  );
}

export default function App() {
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("ua");
  const [activeFilter, setActiveFilter] = useState("all");
  const [hovered, setHovered] = useState(null);
  const t = themes[theme];
  const L = i18n[lang];
  const TL = TAG_LABELS[lang];
  const NAV = NAV_ITEMS[lang];

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const currentWeekVisible = NEWS[0].items.filter(i => itemMatchesFilter(i, activeFilter)).length;

  return (
    <div style={{ minHeight: "100vh", background: t.bg, transition: "background 0.4s ease" }}>

      {/* Nav */}
      <nav style={{ background: t.navBg, borderBottom: "1px solid " + t.navBorder, padding: "0.9rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", transition: "all 0.4s ease" }}>

        {/* Logo + name + tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
          <img src={LOGO_SRC} alt="Когніторіум логотип" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
            <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1.45rem", fontWeight: 700, color: t.text, letterSpacing: "-0.02em", lineHeight: 1, whiteSpace: "nowrap" }}>Когніторіум</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.76rem", fontWeight: 400, letterSpacing: "0.01em", color: t.textMuted, whiteSpace: "nowrap" }}>{L.tagline}</span>
          </div>
        </div>

        {/* Nav links + controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", flexWrap: "nowrap" }}>
          {NAV.map(item => {
            const activeItem = lang === "ua" ? "Новини" : "News";
            const isActive = item === activeItem;
            return (
              <span key={item} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: isActive ? 600 : 400, color: isActive ? t.text : t.textSecondary, cursor: "pointer", borderBottom: isActive ? "1.5px solid " + t.accentLine : "1.5px solid transparent", paddingBottom: "1px", transition: "color 0.2s ease", whiteSpace: "nowrap" }}>{item}</span>
            );
          })}
          <div style={{ width: "1px", height: "14px", background: t.borderStrong, flexShrink: 0 }} />
          <button onClick={() => setLang(l => l === "ua" ? "en" : "ua")} style={{ background: "none", border: "1px solid " + t.borderStrong, borderRadius: "2rem", padding: "0.25rem 0.7rem", cursor: "pointer", color: t.textSecondary, fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{L.langSwitch}</button>
          <ThemeSwitch theme={theme} onToggle={() => setTheme(p => p === "light" ? "dark" : "light")} t={t} />
        </div>
      </nav>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3.5rem 2rem 5rem" }}>

        {/* Page header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "0.5rem" }}>
            <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(1.6rem, 4vw, 2.1rem)", fontWeight: 700, color: t.text, letterSpacing: "-0.02em", lineHeight: 1.05, margin: 0 }}>{L.title}</h1>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: t.textMuted }}>{currentWeekVisible} {L.items}</span>
          </div>
          <div style={{ width: "2.5rem", height: "1.5px", background: t.accentLine, marginBottom: "0.7rem" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: t.accent }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: t.textMuted }}>{L.subtitle} · {L.updated} 1 {L.ago}</span>
          </div>
        </div>

        {/* Tag filter */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {TAGS.map(tag => {
              const isActive = activeFilter === tag;
              const isPrimary = tag !== "funding";
              return (
                <button key={tag} onClick={() => setActiveFilter(tag)} style={{ padding: "5px 13px", borderRadius: "2rem", border: "1px solid " + (isActive ? t.filterActiveBg : t.filterBorder), background: isActive ? t.filterActiveBg : t.filterBg, color: isActive ? t.filterActiveText : isPrimary ? t.filterInactiveText : t.textMuted, fontFamily: "'DM Sans', sans-serif", fontSize: isPrimary ? "0.7rem" : "0.63rem", fontWeight: isActive ? 600 : 400, letterSpacing: "0.02em", cursor: "pointer", transition: "all 0.18s ease", opacity: isPrimary ? 1 : 0.7 }}>
                  {TL[tag]}
                </button>
              );
            })}
          </div>
        </div>

        {/* News grouped by week */}
        {NEWS.map((week, wi) => {
          const visible = week.items.filter(i => itemMatchesFilter(i, activeFilter));
          if (visible.length === 0) return null;
          return (
            <div key={wi} style={{ marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.accent, whiteSpace: "nowrap" }}>
                  {week.isCurrentWeek ? L.thisWeek : (lang === "ua" ? week.week : week.week_en)}
                </span>
                <div style={{ flex: 1, height: "1px", background: t.border }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.56rem", color: t.textMuted }}>{visible.length}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5px", background: t.border }}>
                {visible.map(item => {
                  const isHovered = hovered === item.id;
                  const srcColor = SOURCE_COLORS[item.source] || t.textMuted;
                  return (
                    <div key={item.id} onMouseEnter={() => setHovered(item.id)} onMouseLeave={() => setHovered(null)}
                      style={{ background: isHovered ? t.bgCardHover : t.bgCard, padding: "1.25rem 1.5rem", cursor: "pointer", transition: "background 0.2s ease", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      <div style={{ flexShrink: 0, marginTop: "6px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: srcColor }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.45rem", flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 600, color: srcColor }}>{item.source}</span>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.62rem", color: t.textMuted }}>{lang === "ua" ? item.date : item.date_en}</span>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: t.tagText, background: t.tag, padding: "0 8px", borderRadius: "3px", height: "20px", display: "inline-flex", alignItems: "center" }}>{TL[item.tag]}</span>
                        </div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.4, color: t.text, marginBottom: "0.45rem", letterSpacing: "-0.01em" }}>
                          {lang === "ua" ? item.ua : item.en}
                        </div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.77rem", lineHeight: 1.6, color: t.textSecondary, margin: 0 }}>
                          {lang === "ua" ? item.desc_ua : item.desc_en}
                        </p>
                      </div>
                      <div style={{ flexShrink: 0, color: t.accentLine, fontSize: "0.85rem", opacity: isHovered ? 1 : 0, transition: "opacity 0.2s ease, transform 0.2s ease", transform: isHovered ? "translateX(0)" : "translateX(-4px)", marginTop: "5px" }}>→</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Load more */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <button style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 500, color: t.textSecondary, background: "none", border: "1px solid " + t.borderStrong, borderRadius: "2rem", padding: "0.6rem 1.6rem", cursor: "pointer", letterSpacing: "0.03em", transition: "all 0.2s ease" }}>
            {L.loadMore}
          </button>
        </div>
      </div>
    </div>
  );
}

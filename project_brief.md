# Проєктний бриф: AI News Aggregator

Будуємо RSS Aggregator з підтримкою власного HTML fetch для джерел без офіційного RSS-фіду.



## Контекст

Цей агрегатор будується як перший модуль сайту «Когніторіум» — освітнього ресурсу про AI для учнів, студентів і викладачів. Розділ Новин стане живим контентом сайту з першого дня, а решта розділів «Когніторіум» додаватимуться пізніше навколо нього.

Назва «Когніторіум» — робоча, остаточно не затверджена.



\---

## Мета агрегатора

Збирати новини, не пропускаючи важливих, **виключно з офіційних першоджерел** AI-компаній (не медіа, не перетлумачення) і показувати їх в одному місці. Ключова відмінність від існуючих рішень — прозорість джерела і фокус на первинних анонсах, а не на медійному шумі. Також це необхідно позначити в інтерфейсі подібною нотаткою: "Новини лише з офіційних джерел".



\---

## Особливості та Унікальні фішки (диференціація)

* **Тільки першоджерела** — офіційні блоги компаній, не медіа.
* **Changelog-формат** — хронологічний timeline по компаніях, як keepachangelog.com для AI-індустрії.
* **Теги по типу події та джерелу** — All · top labs · model release · product · research · partnership · safety · hardware · open source · agents · tools · funding. Тег "top labs" охоплює такі джерела: OpenAI, Anthropic, Google AI, Google DeepMind, Meta AI, Microsoft AI, NVIDIA.
* **Паралельні події** — якщо кілька компаній анонсують схоже в один тиждень, система показує це поряд (!важлива killer feature!). Зробити візуально елегантно та очевидно.
* **Повна прозорість** — кожен запис: назва → дата → прямий URL першоджерела → тип події.
* **Без реєстрації, без реклами, відкритий код.**
* **Перемикач мов —** перемикає весь інтерфейс між УКР і ENG — не лише текст новин, а й всі елементи UI: теги, лейбли, кнопки, дати, лічильники. Реалізується через i18n-об'єкт з двома наборами рядків. При перемиканні — повний перерендер інтерфейсу.
* **Переклад новин** — зберігаються дві версії кожного запису в Supabase: title\_ua, title\_en, description\_ua, description\_en. Переклад виконується при збереженні через DeepL API Developer. При перемиканні мови — підтягується відповідне поле з бази, без додаткових запитів до API. MyMemory API — резервний варіант на випадок недоступності DeepL.
* Дедублікація (якщо одна новина є в кількох фідах)
* Оновлення щогодини



\---

### Що навмисно НЕ робимо

* ❌ AI-summary кожної новини (є скрізь, спрощує)
* ❌ Email-розсилка (висока конкуренція)
* ❌ Широкі медіа-джерела (губить фокус)



\---

## Джерела (28 джерел · 10 RSS · 18 HTML fetch)

| # | Джерело | URL | Метод |
|---|---|---|---|
| 1 | OpenAI News | openai.com/news/rss.xml | ✅ RSS |
| 2 | OpenAI Research | openai.com/research | 🔧 HTML fetch |
| 3 | Anthropic | anthropic.com/news | 🔧 HTML fetch |
| 4 | Anthropic Engineering | anthropic.com/engineering | 🔧 HTML fetch |
| 5 | Google AI | blog.google/technology/ai/rss/ | ✅ RSS |
| 6 | Google DeepMind | deepmind.google/discover/blog/rss/ | ✅ RSS |
| 7 | Meta AI | ai.meta.com/blog/ | 🔧 HTML fetch |
| 8 | Microsoft AI | blogs.microsoft.com/ai/feed/ | ✅ RSS |
| 9 | xAI | x.ai/news | 🔧 HTML fetch |
| 10 | Mistral AI | mistral.ai/news | 🔧 HTML fetch |
| 11 | Cohere | cohere.com/blog | 🔧 HTML fetch |
| 12 | NVIDIA Newsroom | nvidianews.nvidia.com/releases.xml | ✅ RSS + keyword фільтр |
| 13 | NVIDIA Developer | developer.nvidia.com/blog/feed/ | ✅ RSS + category фільтр |
| 14 | AWS ML Blog | aws.amazon.com/blogs/machine-learning/feed/ | ✅ RSS |
| 15 | Hugging Face | huggingface.co/blog/feed.xml | ✅ RSS |
| 16 | Fireworks AI | fireworks.ai/blog | 🔧 HTML fetch |
| 17 | Cerebras | cerebras.ai/blog | 🔧 HTML fetch |
| 18 | Ollama | ollama.com/blog | 🔧 HTML fetch |
| 19 | LangChain | langchain.com/blog/rss.xml | ✅ RSS |
| 20 | LlamaIndex | llamaindex.ai/blog?tag=Newsletter | 🔧 HTML fetch |
| 21 | DeepSeek | api-docs.deepseek.com/updates | 🔧 HTML fetch |
| 22 | Qwen | qwen.ai/research | 🔧 HTML fetch |
| 23 | Perplexity | perplexity.ai/hub/blog | 🔧 HTML fetch |
| 24 | Runway | runwayml.com/news | 🔧 HTML fetch |
| 25 | ElevenLabs | elevenlabs.io/blog | 🔧 HTML fetch |
| 26 | Luma AI | lumalabs.ai/blog | 🔧 HTML fetch |
| 27 | Suno | suno.com/blog | 🔧 HTML fetch |
| 28 | Arena (LMSYS) | arena.ai/blog/rss/ | ✅ RSS |

**NVIDIA фільтрація:** Newsroom — keyword whitelist (AI, model, inference, GPU, Blackwell тощо), Developer blog — category теги з фіду (`Agentic AI / Generative AI`, `Training AI Models` тощо). 



\---

## Технічний стек

|Компонент|Рішення|Причина|
|-|-|-|
|Фреймворк|Next.js 14 (App Router)|Статика + API routes в одному проєкті|
|Хостинг|Vercel (Hobby — безкоштовно)|Постійний безкоштовний tier, ідеальний для Next.js|
|База даних|Supabase (безкоштовно, 500MB)|Зберігання архіву новин|
|RSS-парсер|`rss-parser` (npm)|Стандартне рішення|
|Оновлення|Vercel Cron Jobs|Безкоштовно на Hobby|
|Переклад новин|DeepL API Developer |1M символів кредит при реєстрації|
|Стилі|||





\---

## Архітектура оновлення

**Cron: раз на годину** — оптимальний баланс.

* Офіційні блоги публікують 1–5 новин на тиждень, не щогодини
* Раз на годину = новина з'явиться на сайті максимум через \~60 хвилин після публікації
* 24 cron-запуски на добу — добре вкладається в безкоштовні ліміти Vercel

**Потік даних:**

```
Cron (щогодини) → fetch RSS джерел → порівняти з БД → зберегти нові записи → Supabase
Користувач → сторінка новин → дані з Supabase → миттєво
```

Без бази даних новини "протікали" б: RSS зазвичай містить лише 10–20 останніх записів, і старі зникають.



\---

## Ліміти Vercel Hobby (практично)

|Ресурс|Ліміт|Реальне навантаження|
|-|-|-|
|Bandwidth|100GB/міс|\~500K–2M відвідувань. Не проблема на старті|
|Serverless functions|100K викликів/міс|З кешем — мінімальне споживання|
|Cron Jobs|Доступно|24 запуски/добу для новин|
|Function execution|10 сек max|Наші джерела вкладаються|






-- Create the sources table
CREATE TABLE sources (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  url         TEXT NOT NULL,
  feed_url    TEXT,
  method      TEXT NOT NULL,
  is_active   BOOLEAN DEFAULT true,
  is_top_lab  BOOLEAN DEFAULT false,
  color       TEXT
);

-- Create the articles table
CREATE TABLE articles (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id      INTEGER REFERENCES sources(id),
  url            TEXT NOT NULL UNIQUE,
  title_ua       TEXT,
  title_en       TEXT,
  description_ua TEXT,
  description_en TEXT,
  tag            TEXT,
  published_at   TIMESTAMPTZ,
  fetched_at     TIMESTAMPTZ DEFAULT NOW(),
  lang_original  TEXT DEFAULT 'en'
);

-- Indexes for performance
CREATE INDEX articles_published_at_idx ON articles(published_at DESC);
CREATE INDEX articles_source_id_idx ON articles(source_id);
CREATE INDEX articles_tag_idx ON articles(tag);

-- Insert initial sources
INSERT INTO sources (name, url, feed_url, method, is_top_lab, color) VALUES
('OpenAI News', 'https://openai.com/news', 'https://openai.com/news/rss.xml', 'rss', true, '#10A37F'),
('OpenAI Research', 'https://openai.com/research', NULL, 'html', true, '#10A37F'),
('Anthropic', 'https://www.anthropic.com/news', NULL, 'html', true, '#C4552A'),
('Anthropic Engineering', 'https://www.anthropic.com/engineering', NULL, 'html', true, '#C4552A'),
('Google AI', 'https://blog.google/technology/ai/', 'https://blog.google/technology/ai/rss/', 'rss', true, '#4285F4'),
('Google DeepMind', 'https://deepmind.google/discover/blog/', 'https://deepmind.google/discover/blog/rss/', 'rss', true, '#1D9E75'),
('Meta AI', 'https://ai.meta.com/blog/', NULL, 'html', true, '#0668E1'),
('Microsoft AI', 'https://blogs.microsoft.com/ai/', 'https://blogs.microsoft.com/ai/feed/', 'rss', true, '#00A4EF'),
('NVIDIA Newsroom', 'https://nvidianews.nvidia.com/', 'https://nvidianews.nvidia.com/releases.xml', 'rss', true, '#76B900'),
('NVIDIA Developer', 'https://developer.nvidia.com/blog/', 'https://developer.nvidia.com/blog/feed/', 'rss', true, '#76B900'),
('Hugging Face', 'https://huggingface.co/blog', 'https://huggingface.co/blog/feed.xml', 'rss', false, '#FF9D00'),
('Mistral AI', 'https://mistral.ai/news', NULL, 'html', false, '#7C3AED'),
('Cohere', 'https://cohere.com/blog', NULL, 'html', false, '#39A28A'),
('AWS ML Blog', 'https://aws.amazon.com/blogs/machine-learning/', 'https://aws.amazon.com/blogs/machine-learning/feed/', 'rss', false, '#FF9900'),
('Fireworks AI', 'https://fireworks.ai/blog', NULL, 'html', false, '#1A1A1A'),
('Cerebras', 'https://cerebras.ai/blog', NULL, 'html', false, '#1A1A1A'),
('Ollama', 'https://ollama.com/blog', NULL, 'html', false, '#1A1A1A'),
('LangChain', 'https://blog.langchain.dev/', 'https://blog.langchain.dev/rss/', 'rss', false, '#1A1A1A'),
('LlamaIndex', 'https://www.llamaindex.ai/blog', NULL, 'html', false, '#1A1A1A'),
('DeepSeek', 'https://api-docs.deepseek.com/updates', NULL, 'html', false, '#4B6EF5'),
('Perplexity', 'https://www.perplexity.ai/hub/blog', NULL, 'html', false, '#1FB8CD'),
('Runway', 'https://runwayml.com/news', NULL, 'html', false, '#1A1A1A'),
('ElevenLabs', 'https://elevenlabs.io/blog', NULL, 'html', false, '#E84393'),
('Luma AI', 'https://lumalabs.ai/blog', NULL, 'html', false, '#9B59B6'),
('Arena (LMSYS)', 'https://lmsys.org/blog/', 'https://lmsys.org/blog/index.xml', 'rss', false, '#E85D04');

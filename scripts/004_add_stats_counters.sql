-- Adicionar contadores de visualizações e downloads
ALTER TABLE photos
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS downloads_count INTEGER DEFAULT 0;

-- Criar índices para os contadores
CREATE INDEX IF NOT EXISTS photos_views_count_idx ON photos(views_count DESC);
CREATE INDEX IF NOT EXISTS photos_downloads_count_idx ON photos(downloads_count DESC);

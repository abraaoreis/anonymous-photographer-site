-- Adicionar novos campos de metadados às fotos
ALTER TABLE photos
ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS camera TEXT,
ADD COLUMN IF NOT EXISTS aperture TEXT,
ADD COLUMN IF NOT EXISTS lens_type TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Criar índices para buscas
CREATE INDEX IF NOT EXISTS photos_category_idx ON photos(category);
CREATE INDEX IF NOT EXISTS photos_tags_idx ON photos USING GIN(tags);

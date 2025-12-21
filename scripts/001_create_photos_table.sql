-- Crear tabla para almacenar los metadatos de las fotos
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  size INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  megapixels NUMERIC(4,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas más rápidas
CREATE INDEX IF NOT EXISTS photos_created_at_idx ON photos(created_at DESC);
CREATE INDEX IF NOT EXISTS photos_filename_idx ON photos(filename);

-- No necesitamos RLS porque las fotos son públicas y anónimas
ALTER TABLE photos DISABLE ROW LEVEL SECURITY;

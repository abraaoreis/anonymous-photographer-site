-- Adicionar hash de conteúdo para tokenização e integridade
ALTER TABLE photos
ADD COLUMN IF NOT EXISTS content_hash TEXT;

-- Criar índice para o hash de conteúdo
CREATE INDEX IF NOT EXISTS photos_content_hash_idx ON photos(content_hash);

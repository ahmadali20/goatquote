exports.up = (pgm) => {
  pgm.createExtension('vector', { ifNotExists: true });

  pgm.createTable('documents', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    filename: { type: 'text', notNull: true },
    document_type: { type: 'text', notNull: true },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createTable('document_chunks', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    document_id: {
      type: 'uuid',
      notNull: true,
      references: 'documents',
      onDelete: 'cascade',
    },
    content: { type: 'text', notNull: true },
    chunk_index: { type: 'integer', notNull: true },
    embedding: { type: 'vector(1536)' },
    metadata: { type: 'jsonb', default: '{}' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createIndex('document_chunks', 'document_id');
};

exports.down = (pgm) => {
  pgm.dropTable('document_chunks');
  pgm.dropTable('documents');
};
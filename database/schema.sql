PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS animais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(80) NOT NULL,
    idade INTEGER NOT NULL,
    peso DECIMAL(5,2) NOT NULL,
    tutor_nome VARCHAR(120) NOT NULL,
    tutor_telefone VARCHAR(30) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS servicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    animal_id INTEGER NOT NULL,
    tipo_servico VARCHAR(80) NOT NULL,
    veterinario VARCHAR(120) NOT NULL,
    data_servico DATE NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    observacoes TEXT,
    registro_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES animais(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_servicos_animal_id ON servicos(animal_id);
CREATE INDEX IF NOT EXISTS idx_servicos_data ON servicos(data_servico);

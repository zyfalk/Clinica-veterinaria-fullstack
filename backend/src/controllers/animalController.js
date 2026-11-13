const db = require('../config/db');

exports.listarAnimais = (req, res) => {
    const sql = `
        SELECT a.*, COUNT(s.id) AS total_servicos
        FROM animais a
        LEFT JOIN servicos s ON s.animal_id = a.id
        GROUP BY a.id
        ORDER BY a.nome ASC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
};

exports.criarAnimal = (req, res) => {
    const { nome, especie, raca, idade, peso, tutor_nome, tutor_telefone } = req.body;
    if (!nome || !especie || !raca || !tutor_nome) {
        return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
    }
    const sql = `
        INSERT INTO animais (nome, especie, raca, idade, peso, tutor_nome, tutor_telefone)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [nome, especie, raca, Number(idade) || 0, Number(peso) || 0, tutor_nome, tutor_telefone || ''];
    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({
            id: this.lastID,
            nome, especie, raca, idade, peso, tutor_nome, tutor_telefone
        });
    });
};

exports.excluirAnimal = (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM animais WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.json({ alterados: this.changes });
    });
};

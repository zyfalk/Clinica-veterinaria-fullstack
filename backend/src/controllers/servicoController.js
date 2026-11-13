const db = require('../config/db');

exports.listarServicos = (req, res) => {
    const sql = `
        SELECT s.*, a.nome AS animal_nome, a.especie, a.raca, a.tutor_nome
        FROM servicos s
        INNER JOIN animais a ON a.id = s.animal_id
        ORDER BY s.data_servico DESC, s.id DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
};

exports.registrarServico = (req, res) => {
    const { animal_id, tipo_servico, veterinario, data_servico, valor, observacoes } = req.body;
    if (!animal_id || !tipo_servico || !veterinario || !data_servico) {
        return res.status(400).json({ erro: 'Preencha os dados obrigatórios do serviço.' });
    }
    const sql = `
        INSERT INTO servicos (animal_id, tipo_servico, veterinario, data_servico, valor, observacoes)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [Number(animal_id), tipo_servico, veterinario, data_servico, Number(valor) || 0, observacoes || ''];
    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({
            id: this.lastID,
            animal_id, tipo_servico, veterinario, data_servico, valor, observacoes
        });
    });
};

exports.consultarHistoricoPorAnimal = (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM animais WHERE id = ?', [id], (err, animal) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (!animal) return res.status(404).json({ erro: 'Animal não encontrado.' });

        const sqlServicos = `
            SELECT * FROM servicos
            WHERE animal_id = ?
            ORDER BY data_servico DESC, id DESC
        `;
        db.all(sqlServicos, [id], (errServ, servicos) => {
            if (errServ) return res.status(500).json({ erro: err.message });
            const totalGasto = servicos.reduce((acc, item) => acc + Number(item.valor || 0), 0);
            res.json({
                animal,
                resumo: {
                    total_atendimentos: servicos.length,
                    valor_total_acumulado: totalGasto
                },
                historico: servicos
            });
        });
    });
};

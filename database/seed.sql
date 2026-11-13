INSERT INTO animais (id, nome, especie, raca, idade, peso, tutor_nome, tutor_telefone, data_cadastro) VALUES
(1, 'Thor', 'Canina', 'Golden Retriever', 4, 32.50, 'Carlos Eduardo Mendes', '(27) 99812-4410', '2025-02-10 09:15:00'),
(2, 'Luna', 'Felina', 'Siamês', 2, 4.20, 'Mariana Costa Silva', '(27) 99745-8821', '2025-02-14 14:30:00'),
(3, 'Max', 'Canina', 'Bulldog Francês', 3, 12.80, 'Roberto Almeida', '(27) 99931-1092', '2025-03-01 11:00:00'),
(4, 'Mel', 'Canina', 'SRD', 5, 14.00, 'Fernanda Oliveira', '(27) 99604-3319', '2025-03-05 16:20:00');

INSERT INTO servicos (id, animal_id, tipo_servico, veterinario, data_servico, valor, observacoes) VALUES
(1, 1, 'Consulta Clínica', 'Dra. Camila Rocha', '2025-02-12', 150.00, 'Check-up geral anual. Ausculta cardíaca e pulmonar normais.'),
(2, 1, 'Vacinação', 'Dr. Henrique Ribeiro', '2025-02-26', 120.00, 'Aplicação de reforço anual da vacina V10 e antirrábica.'),
(3, 1, 'Exame Laboratorial', 'Dra. Camila Rocha', '2025-03-10', 185.00, 'Hemograma completo e perfil renal e hepático.'),
(4, 2, 'Cirurgia', 'Dr. Henrique Ribeiro', '2025-02-18', 480.00, 'Castração eletiva. Recuperação sem intercorrências.'),
(5, 2, 'Retorno', 'Dr. Henrique Ribeiro', '2025-02-28', 0.00, 'Retirada de pontos cirúrgicos e alta clínica.'),
(6, 3, 'Consulta Dermatológica', 'Dra. Camila Rocha', '2025-03-04', 190.00, 'Quadro leve de dermatite alérgica. Prescrito shampoo terapêutico.'),
(7, 4, 'Exame de Imagem', 'Dr. Lucas Martins', '2025-03-08', 240.00, 'Ultrassonografia abdominal de rotina.');

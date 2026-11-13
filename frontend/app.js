const API_BASE = 'http://localhost:3000/api';

const DADOS_INICIAIS_ANIMAIS = [
    { id: 1, nome: 'Thor', especie: 'Canina', raca: 'Golden Retriever', idade: 4, peso: 32.5, tutor_nome: 'Carlos Eduardo Mendes', tutor_telefone: '(27) 99812-4410' },
    { id: 2, nome: 'Luna', especie: 'Felina', raca: 'Siamês', idade: 2, peso: 4.2, tutor_nome: 'Mariana Costa Silva', tutor_telefone: '(27) 99745-8821' },
    { id: 3, nome: 'Max', especie: 'Canina', raca: 'Bulldog Francês', idade: 3, peso: 12.8, tutor_nome: 'Roberto Almeida', tutor_telefone: '(27) 99931-1092' },
    { id: 4, nome: 'Mel', especie: 'Canina', raca: 'SRD', idade: 5, peso: 14.0, tutor_nome: 'Fernanda Oliveira', tutor_telefone: '(27) 99604-3319' }
];

const DADOS_INICIAIS_SERVICOS = [
    { id: 1, animal_id: 1, tipo_servico: 'Consulta Clínica', veterinario: 'Dra. Camila Rocha', data_servico: '2025-02-12', valor: 150.00, observacoes: 'Check-up geral anual. Ausculta cardíaca e pulmonar normais.' },
    { id: 2, animal_id: 1, tipo_servico: 'Vacinação', veterinario: 'Dr. Henrique Ribeiro', data_servico: '2025-02-26', valor: 120.00, observacoes: 'Aplicação de reforço anual da vacina V10 e antirrábica.' },
    { id: 3, animal_id: 1, tipo_servico: 'Exame Laboratorial', veterinario: 'Dra. Camila Rocha', data_servico: '2025-03-10', valor: 185.00, observacoes: 'Hemograma completo e perfil renal e hepático.' },
    { id: 4, animal_id: 2, tipo_servico: 'Cirurgia', veterinario: 'Dr. Henrique Ribeiro', data_servico: '2025-02-18', valor: 480.00, observacoes: 'Castração eletiva. Recuperação sem intercorrências.' },
    { id: 5, animal_id: 2, tipo_servico: 'Retorno', veterinario: 'Dr. Henrique Ribeiro', data_servico: '2025-02-28', valor: 0.00, observacoes: 'Retirada de pontos cirúrgicos e alta clínica.' },
    { id: 6, animal_id: 3, tipo_servico: 'Consulta Dermatológica', veterinario: 'Dra. Camila Rocha', data_servico: '2025-03-04', valor: 190.00, observacoes: 'Quadro leve de dermatite alérgica. Prescrito shampoo terapêutico.' },
    { id: 7, animal_id: 4, tipo_servico: 'Exame de Imagem', veterinario: 'Dr. Lucas Martins', data_servico: '2025-03-08', valor: 240.00, observacoes: 'Ultrassonografia abdominal de rotina.' }
];

let estadoAnimais = [];
let estadoServicos = [];
let modoApiOnline = false;

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(isoDate) {
    if (!isoDate) return '-';
    const partes = isoDate.split('T')[0].split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : isoDate;
}

function classeBadgeServico(tipo) {
    const t = (tipo || '').toLowerCase();
    if (t.includes('cirurgia')) return 'badge badge-cirurgia';
    if (t.includes('vacina')) return 'badge badge-vacina';
    if (t.includes('exame')) return 'badge badge-exame';
    return 'badge';
}

function exibirMensagem(texto) {
    const el = document.getElementById('alerta-status');
    el.textContent = texto;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 3500);
}

function navegarPara(aba) {
    ['painel', 'animais', 'servicos', 'historico'].forEach(nome => {
        document.getElementById(`secao-${nome}`).classList.toggle('hidden', nome !== aba);
        document.getElementById(`tab-${nome}`).classList.toggle('active', nome === aba);
    });
}

async function carregarDadosSistema() {
    try {
        const [respAnimais, respServicos] = await Promise.all([
            fetch(`${API_BASE}/animais`),
            fetch(`${API_BASE}/servicos`)
        ]);
        if (respAnimais.ok && respServicos.ok) {
            estadoAnimais = await respAnimais.json();
            estadoServicos = await respServicos.json();
            modoApiOnline = true;
            document.getElementById('indicador-api').textContent = '● Conectado ao Servidor';
        } else {
            throw new Error('Fallback local');
        }
    } catch (err) {
        modoApiOnline = false;
        const salvoAnimais = localStorage.getItem('vetcare_animais');
        const salvoServicos = localStorage.getItem('vetcare_servicos');
        estadoAnimais = salvoAnimais ? JSON.parse(salvoAnimais) : [...DADOS_INICIAIS_ANIMAIS];
        estadoServicos = salvoServicos ? JSON.parse(salvoServicos) : [...DADOS_INICIAIS_SERVICOS];
        document.getElementById('indicador-api').textContent = '● Sistema Ativo';
    }

    atualizarInterfaceCompleta();
}

function salvarLocalmente() {
    localStorage.setItem('vetcare_animais', JSON.stringify(estadoAnimais));
    localStorage.setItem('vetcare_servicos', JSON.stringify(estadoServicos));
}

function atualizarInterfaceCompleta() {
    renderizarPainel();
    renderizarTabelaAnimais(estadoAnimais);
    popularSelectsAnimais();
    renderizarTabelaServicos();
    const selectHist = document.getElementById('filtro-historico-animal');
    if (selectHist && selectHist.value) {
        carregarHistoricoAnimal(selectHist.value);
    } else if (estadoAnimais.length > 0) {
        carregarHistoricoAnimal(estadoAnimais[0].id);
    }
}

function renderizarPainel() {
    const totalAnimais = estadoAnimais.length;
    const totalServicos = estadoServicos.length;
    const faturamentoTotal = estadoServicos.reduce((acc, s) => acc + Number(s.valor || 0), 0);
    const ticketMedio = totalServicos > 0 ? faturamentoTotal / totalServicos : 0;

    document.getElementById('kpi-total-animais').textContent = totalAnimais;
    document.getElementById('kpi-total-servicos').textContent = totalServicos;
    document.getElementById('kpi-faturamento').textContent = formatarMoeda(faturamentoTotal);
    document.getElementById('kpi-ticket-medio').textContent = formatarMoeda(ticketMedio);

    const tbody = document.getElementById('tabela-ultimos-servicos');
    tbody.innerHTML = '';

    const servicosOrdenados = [...estadoServicos].sort((a, b) => (b.data_servico || '').localeCompare(a.data_servico || ''));
    servicosOrdenados.slice(0, 6).forEach(serv => {
        const animal = estadoAnimais.find(a => Number(a.id) === Number(serv.animal_id)) || {};
        const nomeAnimal = serv.animal_nome || animal.nome || 'Animal';
        const nomeTutor = serv.tutor_nome || animal.tutor_nome || '-';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarData(serv.data_servico)}</td>
            <td><strong>${nomeAnimal}</strong></td>
            <td>${nomeTutor}</td>
            <td><span class="${classeBadgeServico(serv.tipo_servico)}">${serv.tipo_servico}</span></td>
            <td>${serv.veterinario}</td>
            <td><strong>${formatarMoeda(serv.valor)}</strong></td>
            <td><button class="btn btn-outline btn-sm" onclick="abrirProntuarioDireto(${serv.animal_id})">Ver Histórico</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderizarTabelaAnimais(lista) {
    const tbody = document.getElementById('tabela-animais');
    tbody.innerHTML = '';
    lista.forEach(animal => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${animal.id}</td>
            <td><strong>${animal.nome}</strong></td>
            <td>${animal.especie} - ${animal.raca}</td>
            <td>${animal.idade} anos / ${Number(animal.peso).toFixed(1)} kg</td>
            <td>${animal.tutor_nome}<br><small>${animal.tutor_telefone}</small></td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="abrirProntuarioDireto(${animal.id})">Ver Histórico</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filtrarTabelaAnimais() {
    const termo = (document.getElementById('busca-animal').value || '').toLowerCase();
    const filtrados = estadoAnimais.filter(a =>
        a.nome.toLowerCase().includes(termo) ||
        a.tutor_nome.toLowerCase().includes(termo) ||
        a.raca.toLowerCase().includes(termo)
    );
    renderizarTabelaAnimais(filtrados);
}

async function salvarAnimal(event) {
    event.preventDefault();
    const novoAnimal = {
        nome: document.getElementById('animal-nome').value.trim(),
        especie: document.getElementById('animal-especie').value,
        raca: document.getElementById('animal-raca').value.trim(),
        idade: Number(document.getElementById('animal-idade').value),
        peso: Number(document.getElementById('animal-peso').value),
        tutor_nome: document.getElementById('animal-tutor').value.trim(),
        tutor_telefone: document.getElementById('animal-telefone').value.trim()
    };

    if (modoApiOnline) {
        const resp = await fetch(`${API_BASE}/animais`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoAnimal)
        });
        if (resp.ok) {
            await carregarDadosSistema();
        }
    } else {
        const novoId = estadoAnimais.length > 0 ? Math.max(...estadoAnimais.map(a => a.id)) + 1 : 1;
        estadoAnimais.push({ id: novoId, ...novoAnimal });
        salvarLocalmente();
        atualizarInterfaceCompleta();
    }

    document.getElementById('form-animal').reset();
    exibirMensagem(`Animal ${novoAnimal.nome} cadastrado com sucesso!`);
}

function popularSelectsAnimais() {
    const selServico = document.getElementById('servico-animal');
    const selHistorico = document.getElementById('filtro-historico-animal');
    const valorAtualHist = selHistorico.value;

    selServico.innerHTML = '';
    selHistorico.innerHTML = '';

    estadoAnimais.forEach(a => {
        const opt1 = document.createElement('option');
        opt1.value = a.id;
        opt1.textContent = `${a.nome} - Tutor: ${a.tutor_nome}`;
        selServico.appendChild(opt1);

        const opt2 = opt1.cloneNode(true);
        selHistorico.appendChild(opt2);
    });

    if (valorAtualHist) selHistorico.value = valorAtualHist;
}

function renderizarTabelaServicos() {
    const tbody = document.getElementById('tabela-todos-servicos');
    tbody.innerHTML = '';
    const ordenados = [...estadoServicos].sort((a, b) => (b.data_servico || '').localeCompare(a.data_servico || ''));

    ordenados.forEach(s => {
        const animal = estadoAnimais.find(a => Number(a.id) === Number(s.animal_id)) || {};
        const nomeAnimal = s.animal_nome || animal.nome || '-';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarData(s.data_servico)}</td>
            <td><strong>${nomeAnimal}</strong></td>
            <td><span class="${classeBadgeServico(s.tipo_servico)}">${s.tipo_servico}</span></td>
            <td>${s.veterinario}</td>
            <td><strong>${formatarMoeda(s.valor)}</strong></td>
        `;
        tbody.appendChild(tr);
    });
}

async function salvarServico(event) {
    event.preventDefault();
    const novoServico = {
        animal_id: Number(document.getElementById('servico-animal').value),
        tipo_servico: document.getElementById('servico-tipo').value,
        data_servico: document.getElementById('servico-data').value,
        veterinario: document.getElementById('servico-veterinario').value.trim(),
        valor: Number(document.getElementById('servico-valor').value),
        observacoes: document.getElementById('servico-obs').value.trim()
    };

    if (modoApiOnline) {
        const resp = await fetch(`${API_BASE}/servicos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoServico)
        });
        if (resp.ok) {
            await carregarDadosSistema();
        }
    } else {
        const novoId = estadoServicos.length > 0 ? Math.max(...estadoServicos.map(s => s.id)) + 1 : 1;
        estadoServicos.push({ id: novoId, ...novoServico });
        salvarLocalmente();
        atualizarInterfaceCompleta();
    }

    document.getElementById('form-servico').reset();
    document.getElementById('servico-data').valueAsDate = new Date();
    exibirMensagem('Serviço registrado com sucesso!');
}

async function carregarHistoricoAnimal(animalId) {
    if (!animalId) return;
    document.getElementById('filtro-historico-animal').value = animalId;

    let animal = null;
    let historico = [];

    if (modoApiOnline) {
        try {
            const resp = await fetch(`${API_BASE}/animais/${animalId}/historico`);
            if (resp.ok) {
                const dados = await resp.json();
                animal = dados.animal;
                historico = dados.historico;
            }
        } catch (e) {}
    }

    if (!animal) {
        animal = estadoAnimais.find(a => Number(a.id) === Number(animalId));
        historico = estadoServicos
            .filter(s => Number(s.animal_id) === Number(animalId))
            .sort((a, b) => (b.data_servico || '').localeCompare(a.data_servico || ''));
    }

    if (!animal) return;

    const totalValor = historico.reduce((acc, s) => acc + Number(s.valor || 0), 0);

    document.getElementById('pront-nome').textContent = `${animal.nome} (#${animal.id})`;
    document.getElementById('pront-especie-raca').textContent = `${animal.especie} - ${animal.raca}`;
    document.getElementById('pront-idade-peso').textContent = `${animal.idade} anos / ${Number(animal.peso).toFixed(1)} kg`;
    document.getElementById('pront-tutor').textContent = `${animal.tutor_nome} - ${animal.tutor_telefone}`;
    document.getElementById('pront-total-atend').textContent = `${historico.length} atendimento(s)`;
    document.getElementById('pront-total-valor').textContent = formatarMoeda(totalValor);

    const tbody = document.getElementById('tabela-historico-animal');
    tbody.innerHTML = '';

    if (historico.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Nenhum serviço registrado para este animal.</td></tr>';
        return;
    }

    historico.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarData(item.data_servico)}</td>
            <td><span class="${classeBadgeServico(item.tipo_servico)}">${item.tipo_servico}</span></td>
            <td>${item.veterinario}</td>
            <td>${item.observacoes || '-'}</td>
            <td><strong>${formatarMoeda(item.valor)}</strong></td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirProntuarioDireto(animalId) {
    navegarPara('historico');
    carregarHistoricoAnimal(animalId);
}

window.addEventListener('DOMContentLoaded', () => {
    const campoData = document.getElementById('servico-data');
    if (campoData) campoData.valueAsDate = new Date();
    carregarDadosSistema();
});

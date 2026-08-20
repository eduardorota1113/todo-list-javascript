let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

let filtroAtual = "todas";

const tarefaInput = document.getElementById("tarefa");

const adicionar = document.getElementById("adicionar");

const lista = document.getElementById("lista");

const contador = document.getElementById("contador");

const mensagem = document.getElementById("mensagem");

const limparConcluidas = document.getElementById("limparConcluidas");

const tema = document.getElementById("tema");

const filtros = document.querySelectorAll(".filtro");


function salvarTarefas() {

    localStorage.setItem("tarefas", JSON.stringify(tarefas));

}


function atualizarContador() {

    const pendentes = tarefas.filter(function (tarefa) {

        return !tarefa.concluida;

    }).length;

    const total = tarefas.length;

    if (total === 0) {

        contador.textContent = "0 tarefas";

    } else if (pendentes === 1) {

        contador.textContent = "1 tarefa pendente";

    } else {

        contador.textContent = `${pendentes} tarefas pendentes`;

    }

}


function obterTarefasFiltradas() {

    if (filtroAtual === "pendentes") {

        return tarefas.filter(function (tarefa) {

            return !tarefa.concluida;

        });

    }

    if (filtroAtual === "concluidas") {

        return tarefas.filter(function (tarefa) {

            return tarefa.concluida;

        });

    }

    return tarefas;

}


function renderizarTarefas() {

    lista.innerHTML = "";

    const tarefasFiltradas = obterTarefasFiltradas();

    if (tarefasFiltradas.length === 0) {

        mensagem.classList.remove("escondido");

    } else {

        mensagem.classList.add("escondido");

    }

    tarefasFiltradas.forEach(function (tarefa) {

        const item = document.createElement("li");

        item.classList.add("tarefa-item");

        if (tarefa.concluida) {

            item.classList.add("concluida");

        }

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.classList.add("tarefa-checkbox");

        checkbox.checked = tarefa.concluida;

        checkbox.addEventListener("change", function () {

            alternarTarefa(tarefa.id);

        });

        const texto = document.createElement("span");

        texto.classList.add("tarefa-texto");

        texto.textContent = tarefa.texto;

        const acoes = document.createElement("div");

        acoes.classList.add("acoes");

        const editar = document.createElement("button");

        editar.classList.add("acao", "editar");

        editar.textContent = "✏️";

        editar.title = "Editar tarefa";

        editar.addEventListener("click", function () {

            editarTarefa(tarefa.id);

        });

        const excluir = document.createElement("button");

        excluir.classList.add("acao", "excluir");

        excluir.textContent = "🗑️";

        excluir.title = "Excluir tarefa";

        excluir.addEventListener("click", function () {

            excluirTarefa(tarefa.id);

        });

        acoes.appendChild(editar);

        acoes.appendChild(excluir);

        item.appendChild(checkbox);

        item.appendChild(texto);

        item.appendChild(acoes);

        lista.appendChild(item);

    });

    atualizarContador();

}


function adicionarTarefa() {

    const texto = tarefaInput.value.trim();

    if (texto === "") {

        tarefaInput.focus();

        return;

    }

    const novaTarefa = {

        id: Date.now(),

        texto: texto,

        concluida: false

    };

    tarefas.push(novaTarefa);

    salvarTarefas();

    renderizarTarefas();

    tarefaInput.value = "";

    tarefaInput.focus();

}


function alternarTarefa(id) {

    tarefas = tarefas.map(function (tarefa) {

        if (tarefa.id === id) {

            return {

                ...tarefa,

                concluida: !tarefa.concluida

            };

        }

        return tarefa;

    });

    salvarTarefas();

    renderizarTarefas();

}


function excluirTarefa(id) {

    tarefas = tarefas.filter(function (tarefa) {

        return tarefa.id !== id;

    });

    salvarTarefas();

    renderizarTarefas();

}


function editarTarefa(id) {

    const tarefa = tarefas.find(function (tarefa) {

        return tarefa.id === id;

    });

    if (!tarefa) {

        return;

    }

    const novoTexto = prompt("Edite sua tarefa:", tarefa.texto);

    if (novoTexto === null) {

        return;

    }

    const textoLimpo = novoTexto.trim();

    if (textoLimpo === "") {

        return;

    }

    tarefa.texto = textoLimpo;

    salvarTarefas();

    renderizarTarefas();

}


function trocarFiltro(filtro) {

    filtroAtual = filtro;

    filtros.forEach(function (botao) {

        botao.classList.remove("ativo");

        if (botao.dataset.filtro === filtro) {

            botao.classList.add("ativo");

        }

    });

    renderizarTarefas();

}


function limparTarefasConcluidas() {

    tarefas = tarefas.filter(function (tarefa) {

        return !tarefa.concluida;

    });

    salvarTarefas();

    renderizarTarefas();

}


function alternarTema() {

    document.body.classList.toggle("escuro");

    const escuro = document.body.classList.contains("escuro");

    localStorage.setItem("tema", escuro ? "escuro" : "claro");

    tema.textContent = escuro ? "☀️" : "🌙";

}


function carregarTema() {

    const temaSalvo = localStorage.getItem("tema");

    if (temaSalvo === "escuro") {

        document.body.classList.add("escuro");

        tema.textContent = "☀️";

    }

}


adicionar.addEventListener("click", adicionarTarefa);


tarefaInput.addEventListener("keydown", function (evento) {

    if (evento.key === "Enter") {

        adicionarTarefa();

    }

});


filtros.forEach(function (botao) {

    botao.addEventListener("click", function () {

        trocarFiltro(botao.dataset.filtro);

    });

});


limparConcluidas.addEventListener("click", limparTarefasConcluidas);


tema.addEventListener("click", alternarTema);


carregarTema();

renderizarTarefas();
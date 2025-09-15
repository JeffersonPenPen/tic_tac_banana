// Variáveis
let nomeJogadorX = 'Jogador X';
let nomeJogadorO = 'Jogador O';
let jogadorAtual = 'X';
let tabuleiro = ['', '', '', '', '', '', '', '', ''];
let jogoAtivo = true;
let pontosX = 0;
let pontosO = 0;

// BANANA MODE
let bananaMode = false;
let primeiraPartidaFinalizada = false;

let telaConfiguracao = document.getElementById('telaConfiguracao');
let telaJogo = document.getElementById('telaJogo');
let modalResultado = document.getElementById('modalResultado');

document.addEventListener('DOMContentLoaded', function() {
    configurarEventos();
});

// Eventos
function configurarEventos() {
    // Botão iniciar jogo
    document.getElementById('botaoIniciar').addEventListener('click', iniciarJogo);
    
    // Botões de controle
    document.getElementById('botaoNovoJogo').addEventListener('click', novaPartida);
    document.getElementById('botaoTrocarJogadores').addEventListener('click', voltarConfiguracoes);
    
    // Botões do modal
    document.getElementById('botaoJogarNovamente').addEventListener('click', function() {
        fecharModal();
        novaPartida();
    });
    document.getElementById('botaoTrocarNomes').addEventListener('click', function() {
        fecharModal();
        voltarConfiguracoes();
    });
    
    // NOVOS BOTÕES BANANA MODE
    document.getElementById('botaoBananaMode').addEventListener('click', function() {
        ativarBananaMode();
    });
    document.getElementById('botaoModoNormal').addEventListener('click', function() {
        ativarModoNormal();
    });
    
    // Cliques no tabuleiro
    let celulas = document.querySelectorAll('.celula');
    celulas.forEach(function(celula) {
        celula.addEventListener('click', function() {
            let posicao = parseInt(this.dataset.posicao);
            fazerJogada(posicao);
        });
    });
    
    // Fechar modal
    modalResultado.addEventListener('click', function(evento) {
        if (evento.target === modalResultado) {
            fecharModal();
        }
    });
    
    // Enter nos campos de nome
    document.getElementById('nomeJogadorX').addEventListener('keypress', function(evento) {
        if (evento.key === 'Enter') {
            document.getElementById('nomeJogadorO').focus();
        }
    });
    
    document.getElementById('nomeJogadorO').addEventListener('keypress', function(evento) {
        if (evento.key === 'Enter') {
            iniciarJogo();
        }
    });
}

// BANANA MODE
function ativarBananaMode() {
    bananaMode = true;
    document.getElementById('titulo').textContent = 'Jogo da Velha 🍌 BANANA MODE';
    document.body.classList.add('banana-mode-ativo');
    fecharModal();
    novaPartida();
}

function ativarModoNormal() {
    bananaMode = false;
    document.getElementById('titulo').textContent = 'Jogo da Velha';
    document.body.classList.remove('banana-mode-ativo');
    fecharModal();
    novaPartida();
}

// Iniciar o jogo
function iniciarJogo() {
    let inputX = document.getElementById('nomeJogadorX').value.trim();
    let inputO = document.getElementById('nomeJogadorO').value.trim();
    
    nomeJogadorX = inputX || 'Jogador X';
    nomeJogadorO = inputO || 'Jogador O';
    
    document.getElementById('exibicaoNomeX').textContent = nomeJogadorX;
    document.getElementById('exibicaoNomeO').textContent = nomeJogadorO;
    
    telaConfiguracao.classList.add('escondido');
    telaJogo.classList.remove('escondido');
    
    resetarJogo();
    atualizarPlacar();
    atualizarStatus();
}

// Banana Mode
function fazerJogada(posicao) {
    if (!jogoAtivo || tabuleiro[posicao] !== '') {
        return;
    }
    
    tabuleiro[posicao] = jogadorAtual;
    let celula = document.querySelector(`[data-posicao="${posicao}"]`);

    if (bananaMode) {
        const img = document.createElement('img');
        img.src = jogadorAtual === 'X' ? 'x.png' : 'o.png';
        celula.appendChild(img);
    } else {
        celula.textContent = jogadorAtual;
    }

    celula.classList.add('jogada-' + jogadorAtual.toLowerCase());
    
    if (verificarVitoria()) {
        finalizarJogo('vitoria');
        return;
    }
    
    if (verificarEmpate()) {
        finalizarJogo('empate');
        return;
    }
    
    trocarJogador();
    atualizarStatus();
}

function verificarVitoria() {
    let combinacoesVencedoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (let combinacao of combinacoesVencedoras) {
        let [a, b, c] = combinacao;
        
        if (tabuleiro[a] && 
            tabuleiro[a] === tabuleiro[b] && 
            tabuleiro[a] === tabuleiro[c]) {
            
            destacarCelulasVencedoras([a, b, c]);
            return true;
        }
    }
    return false;
}

function destacarCelulasVencedoras(posicoes) {
    posicoes.forEach(function(posicao) {
        let celula = document.querySelector(`[data-posicao="${posicao}"]`);
        celula.classList.add('vencedora');
    });
}

function verificarEmpate() {
    return tabuleiro.every(function(celula) {
        return celula !== '';
    });
}

function trocarJogador() {
    jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
}

function atualizarStatus() {
    let nomeAtual = jogadorAtual === 'X' ? nomeJogadorX : nomeJogadorO;
    let classeAtual = jogadorAtual === 'X' ? 'vez-jogador-x' : 'vez-jogador-o';
    
    document.getElementById('jogadorAtual').textContent = nomeAtual;
    document.getElementById('jogadorAtual').className = classeAtual;
}

function finalizarJogo(tipo) {
    jogoAtivo = false;
    primeiraPartidaFinalizada = true;
    
    if (tipo === 'vitoria') {
        if (jogadorAtual === 'X') {
            pontosX++;
        } else {
            pontosO++;
        }
        
        let nomeVencedor = jogadorAtual === 'X' ? nomeJogadorX : nomeJogadorO;
        mostrarResultado('Vitória!', nomeVencedor + ' venceu esta partida!');
        
    } else if (tipo === 'empate') {
        mostrarResultado('Empate!', 'Esta partida terminou empatada!');
    }
    atualizarPlacar();
}

function mostrarResultado(titulo, mensagem) {
    document.getElementById('tituloResultado').textContent = titulo;
    document.getElementById('mensagemResultado').textContent = mensagem;
    
    let simboloX = bananaMode ? '🍌' : 'X';
    let simboloO = bananaMode ? '🍎' : 'O';
    
    document.getElementById('placarAtual').innerHTML = 
        '<div>' + nomeJogadorX + ' (' + simboloX + '): ' + pontosX + ' vitórias</div>' +
        '<div>' + nomeJogadorO + ' (' + simboloO + '): ' + pontosO + ' vitórias</div>';
    
    let botaoBanana = document.getElementById('botaoBananaMode');
    let botaoNormal = document.getElementById('botaoModoNormal');
    
    if (primeiraPartidaFinalizada && !bananaMode) {
        botaoBanana.classList.remove('escondido');
        botaoNormal.classList.add('escondido');
    } else if (bananaMode) {
        botaoBanana.classList.add('escondido');
        botaoNormal.classList.remove('escondido');
    } else {
        botaoBanana.classList.add('escondido');
        botaoNormal.classList.add('escondido');
    }
    modalResultado.classList.remove('escondido');
}

function fecharModal() {
    modalResultado.classList.add('escondido');
}

function atualizarPlacar() {
    document.getElementById('pontosX').textContent = pontosX;
    document.getElementById('pontosO').textContent = pontosO;
}

function novaPartida() {
    resetarJogo();
    atualizarStatus();
}

function resetarJogo() {
    tabuleiro = ['', '', '', '', '', '', '', '', ''];
    jogadorAtual = 'X';
    jogoAtivo = true;
    
    let celulas = document.querySelectorAll('.celula');
    celulas.forEach(function(celula) {
        celula.textContent = '';
        celula.innerHTML = '';
        celula.className = 'celula';
    });
}

function voltarConfiguracoes() {
    pontosX = 0;
    pontosO = 0;

    bananaMode = false;
    primeiraPartidaFinalizada = false;
    document.getElementById('titulo').textContent = 'Jogo da Velha';
    document.body.classList.remove('banana-mode-ativo');
    
    telaJogo.classList.add('escondido');
    telaConfiguracao.classList.remove('escondido');
    
    document.getElementById('nomeJogadorX').value = '';
    document.getElementById('nomeJogadorO').value = '';
    document.getElementById('nomeJogadorX').focus();
}
const produtos = [
    { id: 1, nome: 'Teclado Mecânico RGB', preco: 289.90, imagem: '⌨️', categoria: 'perifericos', destaque: true },
    { id: 2, nome: 'Mouse Gamer 8000DPI', preco: 179.90, imagem: '🖱️', categoria: 'perifericos', destaque: true },
    { id: 3, nome: 'Headset Surround 7.1', preco: 329.90, imagem: '🎧', categoria: 'perifericos', destaque: true },
    { id: 4, nome: 'Monitor 24" IPS Full HD', preco: 899.90, imagem: '🖥️', categoria: 'perifericos', destaque: true },
    { id: 5, nome: 'Webcam 4K C/ Microfone', preco: 249.90, imagem: '📷', categoria: 'perifericos', destaque: false },
    { id: 6, nome: 'Microfone Condensador USB', preco: 349.90, imagem: '🎤', categoria: 'perifericos', destaque: false },
    { id: 7, nome: 'Mousepad Gamer XXL', preco: 89.90, imagem: '🟩', categoria: 'acessorios', destaque: true },
    { id: 8, nome: 'Gabinete Gamer Mid-Tower', preco: 449.90, imagem: '🗄️', categoria: 'hardware', destaque: false },
    { id: 9, nome: 'Placa de Vídeo RTX 4060', preco: 2499.90, imagem: '💾', categoria: 'hardware', destaque: true },
    { id: 10, nome: 'Processador Ryzen 7 5700X', preco: 1399.90, imagem: '⚡', categoria: 'hardware', destaque: true },
    { id: 11, nome: 'SSD NVMe 1TB', preco: 549.90, imagem: '💿', categoria: 'hardware', destaque: false },
    { id: 12, nome: 'Memória RAM DDR5 16GB', preco: 429.90, imagem: '🧠', categoria: 'hardware', destaque: true },
    { id: 13, nome: 'Fonte 750W 80 Plus Gold', preco: 599.90, imagem: '🔌', categoria: 'hardware', destaque: false },
    { id: 14, nome: 'Cadeira Gamer Ergonômica', preco: 1399.90, imagem: '🪑', categoria: 'acessorios', destaque: true },
    { id: 15, nome: 'Mesa Digitalizadora', preco: 449.90, imagem: '✏️', categoria: 'acessorios', destaque: false },
    { id: 16, nome: 'Suporte Monitor Articulado', preco: 159.90, imagem: '🔄', categoria: 'acessorios', destaque: false },
    { id: 17, nome: 'Caixa de Som Bluetooth', preco: 199.90, imagem: '🔊', categoria: 'acessorios', destaque: false },
    { id: 18, nome: 'Hub USB-C 7 Portas', preco: 129.90, imagem: '🔌', categoria: 'acessorios', destaque: false },
    { id: 19, nome: 'Teclado Membrana Slim', preco: 89.90, imagem: '⌨️', categoria: 'perifericos', destaque: false },
    { id: 20, nome: 'Mouse Sem Fio Silencioso', preco: 69.90, imagem: '🖱️', categoria: 'perifericos', destaque: false },
];

let carrinho = JSON.parse(localStorage.getItem('techstore_cart')) || [];

function salvarCarrinho() {
    localStorage.setItem('techstore_cart', JSON.stringify(carrinho));
}

function formatarPreco(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function criarCard(produto) {
    const div = document.createElement('div');
    div.className = 'card fade-in';
    div.dataset.categoria = produto.categoria;
    div.innerHTML = `
        <div class="card-img">${produto.imagem}</div>
        <span class="categoria-tag">${produto.categoria}</span>
        <h3>${produto.nome}</h3>
        <div class="price">${formatarPreco(produto.preco)}</div>
        <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
    `;
    return div;
}

function renderizarProdutos(containerId, filtro) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    let lista = produtos;
    if (filtro && filtro !== 'todos') {
        lista = produtos.filter(p => p.categoria === filtro);
    }

    lista.forEach(p => {
        container.appendChild(criarCard(p));
    });
}

function renderizarDestaques() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    container.innerHTML = '';

    const destaques = produtos.filter(p => p.destaque).slice(0, 8);
    destaques.forEach(p => {
        container.appendChild(criarCard(p));
    });
}

function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    const existente = carrinho.find(item => item.id === id);
    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 });
    }

    salvarCarrinho();
    atualizarCarrinhoUI();
    mostrarToast(produto.nome + ' adicionado ao carrinho!');
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho();
    atualizarCarrinhoUI();
}

function alterarQuantidade(id, delta) {
    const item = carrinho.find(i => i.id === id);
    if (!item) return;

    item.quantidade += delta;
    if (item.quantidade <= 0) {
        removerDoCarrinho(id);
        return;
    }

    salvarCarrinho();
    atualizarCarrinhoUI();
}

function limparCarrinho() {
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinhoUI();
    mostrarToast('Carrinho limpo!');
}

function atualizarCarrinhoUI() {
    const count = document.getElementById('cart-count');
    const items = document.getElementById('cart-items');
    const total = document.getElementById('cart-total');

    if (!count || !items || !total) return;

    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    count.textContent = totalItens;

    if (carrinho.length === 0) {
        items.innerHTML = '<p style="text-align:center;color:#b2bec3;padding:30px 0;">Carrinho vazio</p>';
        total.textContent = 'R$ 0,00';
        return;
    }

    items.innerHTML = '';
    let totalPreco = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        totalPreco += subtotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.nome}</h4>
                <p>${formatarPreco(item.preco)}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="alterarQuantidade(${item.id}, -1)">−</button>
                <span>${item.quantidade}</span>
                <button onclick="alterarQuantidade(${item.id}, 1)">+</button>
                <button class="remove" onclick="removerDoCarrinho(${item.id})">🗑️</button>
            </div>
        `;
        items.appendChild(div);
    });

    total.textContent = formatarPreco(totalPreco);
}

let cartAberto = false;

function toggleCart() {
    cartAberto = !cartAberto;
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('show', cartAberto);
    atualizarCarrinhoUI();
}

document.addEventListener('click', function (e) {
    if (cartAberto) {
        const modal = document.getElementById('cart-modal');
        const content = modal.querySelector('.cart-content');
        if (!content.contains(e.target) && !e.target.closest('.cart-icon')) {
            cartAberto = false;
            modal.classList.remove('show');
        }
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cartAberto) {
        cartAberto = false;
        document.getElementById('cart-modal').classList.remove('show');
    }
});

function mostrarToast(mensagem) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = mensagem;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function toggleMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname;

    if (path.includes('produtos')) {
        renderizarProdutos('all-products', 'todos');
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('cat');
        if (cat) {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.cat === cat);
            });
            renderizarProdutos('all-products', cat);
        }
    }

    if (path.includes('index') || path.endsWith('/projeto/') || path.endsWith('/projeto')) {
        renderizarDestaques();
    }

    atualizarCarrinhoUI();

    if (!path.includes('contato')) return;
    document.getElementById('telefone')?.addEventListener('input', function (e) {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length <= 2) {
            valor = '(' + valor;
        } else if (valor.length <= 7) {
            valor = '(' + valor.slice(0, 2) + ') ' + valor.slice(2);
        } else {
            valor = '(' + valor.slice(0, 2) + ') ' + valor.slice(2, 7) + '-' + valor.slice(7, 11);
        }
        e.target.value = valor;
    });
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const cat = this.dataset.cat;
        renderizarProdutos('all-products', cat);
    });
});

function validarContato(event) {
    event.preventDefault();

    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const assunto = document.getElementById('assunto');
    const mensagem = document.getElementById('mensagem');

    const erroNome = document.getElementById('erro-nome');
    const erroEmail = document.getElementById('erro-email');
    const erroTelefone = document.getElementById('erro-telefone');
    const erroAssunto = document.getElementById('erro-assunto');
    const erroMensagem = document.getElementById('erro-mensagem');

    erroNome.textContent = '';
    erroEmail.textContent = '';
    erroTelefone.textContent = '';
    erroAssunto.textContent = '';
    erroMensagem.textContent = '';

    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    let valido = true;

    if (nome.value.trim().length < 3) {
        erroNome.textContent = 'Nome deve ter pelo menos 3 caracteres.';
        nome.closest('.form-group').classList.add('error');
        valido = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        erroEmail.textContent = 'Informe um e-mail válido.';
        email.closest('.form-group').classList.add('error');
        valido = false;
    }

    if (telefone.value.trim() && telefone.value.replace(/\D/g, '').length < 10) {
        erroTelefone.textContent = 'Informe um telefone válido com DDD.';
        telefone.closest('.form-group').classList.add('error');
        valido = false;
    }

    if (!assunto.value) {
        erroAssunto.textContent = 'Selecione um assunto.';
        assunto.closest('.form-group').classList.add('error');
        valido = false;
    }

    if (mensagem.value.trim().length < 10) {
        erroMensagem.textContent = 'Mensagem deve ter pelo menos 10 caracteres.';
        mensagem.closest('.form-group').classList.add('error');
        valido = false;
    }

    if (valido) {
        mostrarToast('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        document.getElementById('contact-form').reset();
    }

    return false;
}

document.addEventListener('DOMContentLoaded', function () {
  inicializarCadastro();
  inicializarProdutos();
  configurarFormularioCadastro();
});

/* === FUNÇÃO: Mostrar campos adicionais com base no grupo (cliente ou vendedor) === */
function inicializarCadastro() {
  const radios = document.querySelectorAll('input[name="grupo"]');
  if (!radios.length) return; // Se não for página de cadastro, sai
  const depositoInfo = document.getElementById('deposito-info');
  

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      depositoInfo.style.display = (radio.value === 'vendedor' && radio.checked)
        ? 'block'
        : 'none';
    });
  });
}

/* === FUNÇÃO: Inicializa página de produtos (home_cliente e home_vendedor) === */
function inicializarProdutos() {
  const linkPostar = document.querySelector('.destaque');
  const formSecao = document.getElementById('form-produto');
  const formProduto = document.getElementById('produtoForm');
  const listaProdutos = document.querySelector('.products');

  if (!formSecao || !formProduto || !listaProdutos) return;

  const nomeInput = document.getElementById('nomeProduto');
  const precoInput = document.getElementById('precoProduto');
  const imagemInput = document.getElementById('imagemProduto');
  const editandoProdutoId = document.getElementById('editandoProdutoId');

  let idContador = 1000;

  // Mostrar formulário para adicionar novo produto
  linkPostar.addEventListener('click', function (e) {
    e.preventDefault();
    formSecao.style.display = 'block';
    formProduto.reset();
    editandoProdutoId.value = '';
  });

  // Submissão do formulário (add ou editar)
  formProduto.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = nomeInput.value.trim();
    const preco = precoInput.value.trim();
    const imagem = imagemInput.value.trim();
    const id = editandoProdutoId.value;

    if (!nome || !preco || !imagem) {
      alert('Preencha todos os campos do produto!');
      return;
    }

    if (id) {
      // Editar produto existente
      const produto = document.querySelector(`.product-card[data-id="${id}"]`);
      if (produto) {
        produto.querySelector('h3').textContent = nome;
        produto.querySelector('p').textContent = `R$ ${preco}`;
        produto.querySelector('img').src = imagem;
        produto.querySelector('img').alt = nome;
      }
    } else {
      // Adicionar novo produto
      const novoProduto = document.createElement('div');
      novoProduto.classList.add('product-card');
      novoProduto.dataset.id = idContador++;

      novoProduto.innerHTML = `
        <img src="${imagem}" alt="${nome}">
        <h3>${nome}</h3>
        <p>R$ ${preco}</p>
        <div class="acoes">
          <button class="editar">✏️</button>
          <button class="excluir">🗑️</button>
        </div>
      `;

      listaProdutos.appendChild(novoProduto);
    }

    formProduto.reset();
    formSecao.style.display = 'none';
    editandoProdutoId.value = '';
  });

  // Delegação: editar ou excluir produto
  listaProdutos.addEventListener('click', function (e) {
    const card = e.target.closest('.product-card');
    if (!card) return;

    const id = card.dataset.id;

    if (e.target.classList.contains('editar')) {
      nomeInput.value = card.querySelector('h3').textContent;
      precoInput.value = card.querySelector('p').textContent.replace('R$ ', '');
      imagemInput.value = card.querySelector('img').getAttribute('src');
      editandoProdutoId.value = id;
      formSecao.style.display = 'block';

    } else if (e.target.classList.contains('excluir')) {
      if (confirm('Deseja realmente excluir este produto?')) {
        card.remove();
      }
    }
  });
}

/* === FUNÇÃO: Validação do formulário de cadastro e redirecionamento === */
function configurarFormularioCadastro() {
  const formCadastro = document.querySelector('form#form-cadastro');
  if (!formCadastro) return;

  formCadastro.addEventListener('submit', validarFormulario);
}

function validarFormulario(event) {
  event.preventDefault();

  const camposObrigatorios = [
    'nome',
    'cpf',
    'endereco',
    'telefone',
    'email',
    'senha',
    'confirmar-senha'
  ];

  for (let id of camposObrigatorios) {
    const campo = document.getElementById(id);
    if (!campo || !campo.value.trim()) {
      alert(`Preencha o campo: ${campo?.previousElementSibling?.innerText || id}`);
      campo?.focus();
      return;
    }
  }

  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmar-senha').value;

  if (senha !== confirmarSenha) {
    alert('As senhas não coincidem!');
    document.getElementById('confirmar-senha').focus();
    return;
  }

  // Verifica qual grupo foi selecionado
  const grupoSelecionado = document.querySelector('input[name="grupo"]:checked');
  if (!grupoSelecionado) {
    alert('Selecione um tipo de usuário.');
    return;
  }

  alert('Cadastro realizado com sucesso!');

  // Redirecionamento por grupo
  const destino = grupoSelecionado.value === 'cliente'
    ? 'home_cliente.html'
    : 'home_vendedor.html';

  window.location.href = destino;
}

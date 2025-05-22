document.addEventListener('DOMContentLoaded', function () {
  // Variáveis globais para produto
  const linkPostar = document.querySelector('.destaque');
  const formSecao = document.getElementById('form-produto');
  const formProduto = document.getElementById('produtoForm');
  const listaProdutos = document.querySelector('.products');

  const nomeInput = document.getElementById('nomeProduto');
  const precoInput = document.getElementById('precoProduto');
  const imagemInput = document.getElementById('imagemProduto');
  const editandoProdutoId = document.getElementById('editandoProdutoId');

  let idContador = 1000;

  // Mostrar formulário para novo produto
  linkPostar.addEventListener('click', function (e) {
    e.preventDefault();
    formSecao.style.display = 'block';
    formProduto.reset();
    editandoProdutoId.value = '';
  });

  // Envio do formulário produto (adicionar ou editar)
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
      // Editar produto
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

  // Delegação de eventos para editar e excluir
  listaProdutos.addEventListener('click', function (e) {
    const card = e.target.closest('.product-card');
    if (!card) return;

    const id = card.dataset.id;

    if (e.target.classList.contains('editar')) {
      const nome = card.querySelector('h3').textContent;
      const preco = card.querySelector('p').textContent.replace('R$ ', '');
      const imagem = card.querySelector('img').getAttribute('src');

      nomeInput.value = nome;
      precoInput.value = preco;
      imagemInput.value = imagem;
      editandoProdutoId.value = id;

      formSecao.style.display = 'block';

    } else if (e.target.classList.contains('excluir')) {
      if (confirm('Deseja realmente excluir este produto?')) {
        card.remove();
      }
    }
  });

  // *** Aqui você pode adicionar a ligação da função validarFormulario para seu form de cadastro ***
});

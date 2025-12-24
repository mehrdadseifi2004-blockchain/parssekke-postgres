import { supabase, PRODUCT_TYPE_COIN, PRODUCT_TYPE_GEMSTONE } from './supabase.js';

async function fetchProducts(type) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

async function addToCart(productId, quantity = 1) {
  const { data: existingItem, error: selectError } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('product_id', productId)
    .maybeSingle();

  if (selectError && selectError.code !== 'PGRST116') {
    console.error('Error reading cart_items:', selectError);
    return null;
  }

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: newQty })
      .eq('id', existingItem.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating cart_items:', error);
      return null;
    }

    return data;
  } else {
    const { data, error } = await supabase
      .from('cart_items')
      .insert([{ product_id: productId, quantity }])
      .select()
      .single();

    if (error) {
      console.error('Error inserting cart_items:', error);
      return null;
    }

    return data;
  }
}

async function getCartItems() {
  const { data, error } = await supabase
    .from('cart_items')
    .select(
      `
      id,
      quantity,
      products:product_id (
        id,
        name,
        price,
        image_url,
        type
      )
    `
    )
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching cart_items:', error);
    return [];
  }

  return data || [];
}

function formatPrice(value) {
  if (value == null) return '0';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString('fa-IR') + ' تومان';
}

function renderProducts(container, products) {
  if (!container) return;
  container.innerHTML = '';

  if (!products.length) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'هیچ محصولی یافت نشد.';
    container.appendChild(emptyMsg);
    return;
  }

  products.forEach((product) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'product-thumb clearfix';
    wrapper.innerHTML = `
      <div class="image">
        <a href="product.html">
          <img src="${product.image_url || 'image/no_image.jpg'}" alt="${product.name}" title="${product.name}" class="img-responsive" />
        </a>
      </div>
      <div class="caption">
        <h4><a href="product.html">${product.name}</a></h4>
        <p class="price">${formatPrice(product.price)}</p>
      </div>
      <div class="button-group">
        <button class="btn-primary btn-add-to-cart" type="button" data-product-id="${product.id}">
          <span>افزودن به سبد</span>
        </button>
      </div>
    `;
    container.appendChild(wrapper);
  });
// RE-INIT OWL CAROUSEL AFTER PRODUCTS RENDER
if (window.$ && container.classList.contains('owl-carousel')) {
  $(container).trigger('destroy.owl.carousel');
  $(container).owlCarousel({
    items: 4,
    margin: 10,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 4 }
    }
  });
}
  if (!container.dataset.listenerAdded) {
    container.addEventListener('click', async (event) => {
      const target = event.target.closest('.btn-add-to-cart');
      if (!target) return;
      const productId = target.getAttribute('data-product-id');
      if (!productId) return;
      await addToCart(productId, 1);
      alert('محصول به سبد افزوده شد.');
      await refreshMiniCart();
    });
    container.dataset.listenerAdded = 'true';
  }
}

async function renderCartPage() {
  const tableBody = document.getElementById('cart-table-body');
  const totalCell = document.getElementById('cart-total-sum');

  if (!tableBody || !totalCell) return;

  const items = await getCartItems();
  tableBody.innerHTML = '';

  if (!items.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="text-center" colspan="6">سبد خرید خالی است</td>`;
    tableBody.appendChild(tr);
    totalCell.textContent = formatPrice(0);
    return;
  }

  let total = 0;

  items.forEach((item) => {
    const product = item.products;
    if (!product) return;

    const lineTotal = Number(product.price) * item.quantity;
    total += lineTotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="text-center">
        ${product.image_url ? `<img src="${product.image_url}" alt="${product.name}" class="img-thumbnail" />` : ''}
      </td>
      <td class="text-left">${product.name}</td>
      <td class="text-left">${product.id}</td>
      <td class="text-left">
        <div class="input-group btn-block" style="max-width: 200px;">
          <input type="number" min="0" value="${item.quantity}" class="form-control cart-qty-input" data-cart-id="${item.id}" />
          <span class="input-group-btn">
            <button type="button" class="btn btn-primary cart-btn-update" data-cart-id="${item.id}">
              <i class="fa fa-refresh"></i>
            </button>
            <button type="button" class="btn btn-danger cart-btn-remove" data-cart-id="${item.id}">
              <i class="fa fa-times-circle"></i>
            </button>
          </span>
        </div>
      </td>
      <td class="text-right">${formatPrice(product.price)}</td>
      <td class="text-right">${formatPrice(lineTotal)}</td>
    `;
    tableBody.appendChild(tr);
  });

  totalCell.textContent = formatPrice(total);

  tableBody.addEventListener('click', async (event) => {
    const updateBtn = event.target.closest('.cart-btn-update');
    const removeBtn = event.target.closest('.cart-btn-remove');

    if (updateBtn) {
      const cartId = updateBtn.getAttribute('data-cart-id');
      const input = tableBody.querySelector(`.cart-qty-input[data-cart-id="${cartId}"]`);
      if (!input) return;
      const newQty = Number(input.value);

      if (newQty <= 0) {
        await supabase.from('cart_items').delete().eq('id', cartId);
      } else {
        await supabase.from('cart_items').update({ quantity: newQty }).eq('id', cartId);
      }
      await renderCartPage();
      await refreshMiniCart();
    }

    if (removeBtn) {
      const cartId = removeBtn.getAttribute('data-cart-id');
      await supabase.from('cart_items').delete().eq('id', cartId);
      await renderCartPage();
      await refreshMiniCart();
    }
  });
}

async function renderCheckoutSummary() {
  const summaryTable = document.getElementById('checkout-cart-body');
  const totalCell = document.getElementById('checkout-total-sum');

  if (!summaryTable || !totalCell) return;

  const items = await getCartItems();
  summaryTable.innerHTML = '';

  if (!items.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="text-center" colspan="5">سبد خرید خالی است</td>`;
    summaryTable.appendChild(tr);
    totalCell.textContent = formatPrice(0);
    return;
  }

  let total = 0;

  items.forEach((item) => {
    const product = item.products;
    if (!product) return;

    const lineTotal = Number(product.price) * item.quantity;
    total += lineTotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="text-center">
        ${product.image_url ? `<img src="${product.image_url}" alt="${product.name}" class="img-thumbnail" />` : ''}
      </td>
      <td class="text-left">${product.name}</td>
      <td class="text-left">${item.quantity}</td>
      <td class="text-right">${formatPrice(product.price)}</td>
      <td class="text-right">${formatPrice(lineTotal)}</td>
    `;
    summaryTable.appendChild(tr);
  });

  totalCell.textContent = formatPrice(total);
}

async function refreshMiniCart() {
  const miniCartTotal = document.getElementById('cart-total');
  if (!miniCartTotal) return;

  const items = await getCartItems();
  let total = 0;
  let count = 0;

  items.forEach((item) => {
    const product = item.products;
    if (!product) return;
    const lineTotal = Number(product.price) * item.quantity;
    total += lineTotal;
    count += item.quantity;
  });

  miniCartTotal.textContent = `${count} آیتم - ${formatPrice(total)}`;
}

async function initIndexPage() {
  const container = document.getElementById('coin-products-container');
  if (!container) return;
  const products = await fetchProducts(PRODUCT_TYPE_COIN);
  renderProducts(container, products);
}

async function initCategoryPage() {
  const container = document.getElementById('gemstone-products-container');
  if (!container) return;
  const products = await fetchProducts(PRODUCT_TYPE_GEMSTONE);
  renderProducts(container, products);
}

document.addEventListener('DOMContentLoaded', async () => {
  await initIndexPage();
  await initCategoryPage();
  await renderCartPage();
  await renderCheckoutSummary();
  await refreshMiniCart();
});

export { fetchProducts, addToCart, getCartItems };



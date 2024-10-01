document.addEventListener('DOMContentLoaded', () => {
    const productTableBody = document.getElementById('productTableBody');
    const createProductBtn = document.getElementById('createProductBtn');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const closeModal = document.querySelector('.close');
    const saveProductBtn = document.getElementById('saveProductBtn');
    const productNameInput = document.getElementById('productName');
    const productImageInput = document.getElementById('productImage');
    const productPriceInput = document.getElementById('productPrice');
    let editingProductId = null;
  
    createProductBtn.addEventListener('click', () => {
        editingProductId = null;
        modalTitle.textContent = 'Create Product';
        saveProductBtn.textContent = 'Tạo';
        modal.style.display = 'flex';
        clearForm();
    });

    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    saveProductBtn.addEventListener('click', () => {
        const name = productNameInput.value;
        const image = productImageInput.value;
        const price = productPriceInput.value;

        if (!name || !image || !price) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }
  
        const product = { id: Date.now(), name, image, price };
        if (editingProductId) {
            updateProduct(editingProductId, product);
        } else {
            addProduct(product);
        }
        modal.style.display = 'none';
        renderTable();
    });
  
    function addProduct(product) {
        const products = getProductsFromLocalStorage();
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
    }
  
    function getProductsFromLocalStorage() {
        return JSON.parse(localStorage.getItem('products')) || [];
    }
  
    function updateProduct(id, updatedProduct) {
        let products = getProductsFromLocalStorage();
        products = products.map(product => (product.id === id ? { ...product, ...updatedProduct } : product));
        localStorage.setItem('products', JSON.stringify(products));
    }
  
    function deleteProduct(id) {
        let products = getProductsFromLocalStorage();
        products = products.filter(product => 
            product.id !== id
        );
        localStorage.setItem('products', JSON.stringify(products));
        renderTable();
    }
  
    function renderTable() {
        const products = getProductsFromLocalStorage();
        productTableBody.innerHTML = '';
  
        products.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td><img src="${product.image}" width="50"></td>
            <td>${product.price}</td>
            <td>
                <button class="edit-btn button" data-id="${product.id}">Sửa</button>
                <button class="delete-btn button" data-id="${product.id}">Xóa</button>
            </td>
            `;
        productTableBody.appendChild(row);
        });
  
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            const product = getProductsFromLocalStorage().find(p => p.id == productId);
            editingProductId = product.id;
            productNameInput.value = product.name;
            productImageInput.value = product.image;
            productPriceInput.value = product.price;
            modalTitle.textContent = 'Edit Product';
            saveProductBtn.textContent = 'Cập nhật';
            modal.style.display = 'flex';
            });
        });
  
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
            const productId = Number(e.target.getAttribute('data-id'));
            deleteProduct(productId);
            });
        });
    }

    // Clear form inputs
    function clearForm() {
        productNameInput.value = '';
        productImageInput.value = '';
        productPriceInput.value = '';
    }
  
    // Initial render
    renderTable();
});
  
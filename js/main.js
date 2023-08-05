    // JavaScript code for fetching data and handling events

    // API URL
    const apiUrl = 'http://localhost:3000/products';

    // Function to fetch products from the API
    async function fetchProducts() {
    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
    }

    // Function to render the product list
    function renderProducts(products) {
    const productsSection = document.querySelector('.product-list');
    productsSection.innerHTML = '';

    products.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
        <h3>${product.name}</h3>
        <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
        <p>${product.description}</p>
        <button class="edit-btn" data-id="${product.id}">Edit</button>
        <button class="delete-btn" data-id="${product.id}">Delete</button>
        `;

        productsSection.appendChild(productCard);
    });

    // Add event listeners for edit and delete buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    editButtons.forEach((button) => {
        button.addEventListener('click', handleEditProduct);
    });

    deleteButtons.forEach((button) => {
        button.addEventListener('click', handleDeleteProduct);
    });
    }

    // Function to handle the form submission for adding a new product
    async function handleAddProduct(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await axios.post(apiUrl, {
        name: formData.get('name'),
        price: parseFloat(formData.get('price')),
        description: formData.get('description'),
        });

        form.reset();
        alert('Product added successfully!');
        const products = await fetchProducts();
        renderProducts(products);
    } catch (error) {
        console.error('Error adding product:', error);
        alert('An error occurred while adding the product.');
    }
    }

    // Function to handle the form submission for editing a product
    async function handleEditProduct(event) {
    const productId = event.target.dataset.id;
    const productCard = event.target.closest('.product-card');
    const productDetails = productCard.querySelectorAll('p');

    const editForm = document.querySelector('.edit-product-form');
    const editFormInputs = editForm.querySelectorAll('input, textarea');

    // Fill the edit form with the current product details
    editForm.querySelector('[name="id"]').value = productId;
    editForm.querySelector('[name="name"]').value = productCard.querySelector('h3').textContent;
    editForm.querySelector('[name="price"]').value = parseFloat(productDetails[0].textContent.replace('Price: $', ''));
    editForm.querySelector('[name="description"]').value = productDetails[1].textContent;

    // Show the edit form and hide the add form
    editForm.style.display = 'block';
    document.querySelector('.add-product-form').style.display = 'none';
    }

    // Function to handle the form submission for updating a product
    async function handleUpdateProduct(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const productId = formData.get('id');

    try {
        const response = await axios.put(`${apiUrl}/${productId}`, {
        name: formData.get('name'),
        price: parseFloat(formData.get('price')),
        description: formData.get('description'),
        });

        form.reset();
        alert('Product updated successfully!');
        const products = await fetchProducts();
        renderProducts(products);

        // Show the add form and hide the edit form
        document.querySelector('.add-product-form').style.display = 'block';
        form.style.display = 'none';
    } catch (error) {
        console.error('Error updating product:', error);
        alert('An error occurred while updating the product.');
    }
    }

    // Function to handle the delete button click for a product
    async function handleDeleteProduct(event) {
    const productId = event.target.dataset.id;

    if (confirm('Are you sure you want to delete this product?')) {
        try {
        const response = await axios.delete(`${apiUrl}/${productId}`);
        alert('Product deleted successfully!');
        const products = await fetchProducts();
        renderProducts(products);
        } catch (error) {
        console.error('Error deleting product:', error);
        alert('An error occurred while deleting the product.');
        }
    }
    }

    // Function to initialize the admin panel
    function initAdminPanel() {
    const addProductForm = document.querySelector('.add-product-form');
    const editProductForm = document.querySelector('.edit-product-form');

    addProductForm.addEventListener('submit', handleAddProduct);
    editProductForm.addEventListener('submit', handleUpdateProduct);

    const cancelBtn = document.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
        addProductForm.style.display = 'block';
        editProductForm.style.display = 'none';
    });
    }

    // Function to initialize the app
    async function initApp() {
    // Fetch products from the API
    const products = await fetchProducts();
    // Render the product list
    renderProducts(products);
    // Initialize the admin panel
    initAdminPanel();
    }

    // Run the app
    initApp();

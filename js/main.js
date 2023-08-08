    // JavaScript code for fetching data and handling events
    // código JavaScript para obtener datos y manejar eventos

    // API URL
    const apiUrl = 'http://localhost:3000/products';

    // Function to fetch products from the API
    // Función para obtener productos de la API
    async function fetchProducts() {
    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return [];
    }
    }

    // Function to render the product list
    // Función para renderizar la lista de productos
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
        <button class="edit-btn" data-id="${product.id}" >Edit</button>
        <button class="delete-btn" data-id="${product.id}">Delete</button>
        `;

        productsSection.appendChild(productCard);
    });

    // Add event listeners for edit and delete buttons
    // Agregar eventos de escucha para los botones de edición y eliminación
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
    // Función para manejar el envío del formulario para agregar un nuevo producto
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
        alert('¡Producto agregado con éxito!');
        const products = await fetchProducts();
        renderProducts(products);
    } catch (error) {
        console.error('Error al agregar producto:', error);
        alert('Ocurrió un error al agregar el producto.');
    }
    }

    // Function to handle the form submission for editing a product
    // Función para manejar el envío de formularios para editar un producto
    async function handleEditProduct(event) {
    const productId = event.target.dataset.id;
    const productCard = event.target.closest('.product-card');
    const productDetails = productCard.querySelectorAll('p');

    const editForm = document.querySelector('.edit-product-form');
    const editFormInputs = editForm.querySelectorAll('input, textarea');

    // Fill the edit form with the current product details
    // Rellenar el formulario de edición con los detalles del producto actual
    editForm.querySelector('[name="id"]').value = productId;
    editForm.querySelector('[name="name"]').value = productCard.querySelector('h3').textContent;
    editForm.querySelector('[name="price"]').value = parseFloat(productDetails[0].textContent.replace('Price: $', ''));
    editForm.querySelector('[name="description"]').value = productDetails[1].textContent;

    // Show the edit form and hide the add form
    // Mostrar el formulario de edición y ocultar el formulario de adición
    editForm.style.display = 'block';
    document.querySelector('.add-product-form').style.display = 'none';
    }

    // Function to handle the form submission for updating a product
    // Función para manejar el envío de formularios para actualizar un producto
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
        alert('¡Producto actualizado con éxito!');
        const products = await fetchProducts();
        renderProducts(products);

        // Show the add form and hide the edit form
        // Mostrar el formulario de adición y ocultar el formulario de edición
        document.querySelector('.add-product-form').style.display = 'block';
        form.style.display = 'none';
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        alert('Ocurrió un error al actualizar el producto.');
    }
    }

    // Function to handle the delete button click for a product
    // Función para manejar el clic en el botón Eliminar para un producto
    async function handleDeleteProduct(event) {
    const productId = event.target.dataset.id;

    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
        try {
        const response = await axios.delete(`${apiUrl}/${productId}`);
        alert('Producto eliminado exitosamente!');
        const products = await fetchProducts();
        renderProducts(products);
        } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('Ocurrió un error al eliminar el producto.');
        }
    }
    }

    // Function to initialize the admin panel
    // Función para inicializar el panel de administración
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
    // Función para inicializar la aplicación
    async function initApp() {
    // Fetch products from the API
    // Obtener productos de la API
    const products = await fetchProducts();
    // Render the product list // Renderizar la lista de productos
    renderProducts(products);
    // Initialize the admin panel
    // Inicializar el panel de administración
    initAdminPanel();
    }

    // Run the app
    // ejecutar la aplicacion
    initApp();

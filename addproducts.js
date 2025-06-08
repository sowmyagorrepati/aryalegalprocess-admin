document.getElementById('productForm').addEventListener('submit', function(e) {
  e.preventDefault(); // prevent actual form submission

  // Clear previous errors
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(el => el.remove());

  let valid = true;

  // Helper function to show error
  function showError(input, message) {
    valid = false;
    const error = document.createElement('div');
    error.className = 'error-message';
    error.style.color = 'red';
    error.style.fontSize = '14px';
    error.style.marginTop = '4px';
    error.textContent = message;
    input.parentNode.insertBefore(error, input.nextSibling);
  }

  // Validate Barcode
  const barcode = document.getElementById('barcode');
  if (!barcode.value.trim()) {
    showError(barcode, 'Barcode Number is required.');
  }

  // Validate Product Name
  const productName = document.getElementById('product-name');
  if (!productName.value.trim()) {
    showError(productName, 'Product Name is required.');
  }

  // Validate Product Details (textarea)
  const productDetails = document.getElementById('product-details');
  if (!productDetails.value.trim()) {
    showError(productDetails, 'Product Details are required.');
  }

  // Validate Weightage
  const weightage = document.getElementById('weightage');
  if (!weightage.value.trim()) {
    showError(weightage, 'Product Weightage is required.');
  }

  // Validate Quantity
  const quantity = document.getElementById('quantity');
  if (!quantity.value.trim()) {
    showError(quantity, 'Product Quantity is required.');
  }

  // Validate Company selection
  const company = document.getElementById('company');
  if (!company.value) {
    showError(company, 'Please select a company.');
  }

  // Validate Product Description (textarea)
  const description = document.getElementById('description');
  if (!description.value.trim()) {
    showError(description, 'Product Description is required.');
  }

  // Validate Image (optional: you can add required if needed)
  const image = document.getElementById('image');
  if (!image.value) {
    showError(image, 'Please upload a product image.');
  }

  // Validate Start Date
  const startDate = document.getElementById('start-date');
  if (!startDate.value) {
    showError(startDate, 'Start Date is required.');
  }

  // Validate End Date
  const endDate = document.getElementById('end-date');
  if (!endDate.value) {
    showError(endDate, 'End Date is required.');
  }

  // Validate Price
  const price = document.getElementById('price');
  if (!price.value.trim()) {
    showError(price, 'Price is required.');
  }

    if (valid) {
  const productData = {
    barcode: barcode.value.trim(),
    name: productName.value.trim(),
    details: productDetails.value.trim(),
    weight: weightage.value.trim(),
    quantity: quantity.value.trim(),
    company: company.value,
    description: description.value.trim(),
    startDate: startDate.value,
    endDate: endDate.value,
    price: price.value.trim()
  };

fetch("https://productslist.onrender.com/api/products", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  })
  .then(response => {
    if (response.ok) {
      alert('Product added successfully!');
      document.getElementById('productForm').reset();
    } else {
      alert('Failed to add product.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred.');
  });
}

});

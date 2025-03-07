const cart = {};

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.getAttribute("data-product-id");
    const productName = button.getAttribute("data-product-name");
    const price = parseFloat(button.getAttribute("data-price"));
    
    if (!cart[productId]) {
      cart[productId] = { name: productName, quantity: 1, price: price };
    } else {
      cart[productId].quantity++;
    }
    updateCartDisplay();
  });
});

function updateCartDisplay() {
  const cartElement = document.getElementById("cart");
  cartElement.innerHTML = "";
  
  let totalPrice = 0;
  const table = document.createElement("table");
  table.classList.add("table", "table-striped", "table-bordered", "text-center");

  const thead = document.createElement("thead");
  thead.innerHTML = `<tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th><th>Actions</th></tr>`;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  
  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;
    totalPrice += itemTotalPrice;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>฿${item.price.toFixed(2)}</td>
      <td>฿${itemTotalPrice.toFixed(2)}</td>
      <td><button class="btn btn-danger delete-product" data-product-id="${productId}"><i class="fa-solid fa-trash-can"></i></button></td>
    `;
    
    tr.querySelector(".delete-product").addEventListener("click", () => {
      delete cart[productId];
      updateCartDisplay();
    });
    
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  cartElement.appendChild(table);

  if (Object.keys(cart).length > 0) {
    const totalPriceElement = document.createElement("p");
    totalPriceElement.innerHTML = `<strong>Total Price: ฿${totalPrice.toFixed(2)}</strong>`;
    cartElement.appendChild(totalPriceElement);
  } else {
    cartElement.innerHTML = "<p>No items in cart.</p>";
  }
}

document.getElementById("printCart").addEventListener("click", () => {
  printReceipt("Cart Receipt", generateCartReceipt());
});

function printReceipt(title, content) {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html><head><title>${title}</title></head><body>${content}</body></html>
  `);
  printWindow.document.close();
  printWindow.print();
}

function generateCartReceipt() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("th-TH");
  const formattedTime = now.toLocaleTimeString("th-TH");
  const receiptNumber = Math.floor(100000 + Math.random() * 900000);

  let receiptContent = `
    <style>
      @page { size: A5; margin: 10mm; }
      body { font-family: Arial, sans-serif; text-align: center; }
      h2 { margin-bottom: 10px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
      th, td { border: 1px solid #ddd; padding: 5px; text-align: center; }
      th { background-color: #f2f2f2; }
      .receipt-header { text-align: center; }
      .receipt-footer { margin-top: 20px; font-size: 14px; }
    </style>
    <div class="receipt-header">
      <h2>IHASCOM SHOP</h2>
      <p><strong>Receipt No:</strong> ${receiptNumber}</p>
      <p><strong>Date:</strong> ${formattedDate} <strong>Time:</strong> ${formattedTime}</p>
      <hr>
    </div>
    <table>
      <thead>
        <tr>
          <th>Product</th><th>Quantity</th><th>Price</th><th>Total</th>
        </tr>
      </thead>
      <tbody>
  `;

  let totalPrice = 0;
  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;
    totalPrice += itemTotalPrice;
    receiptContent += `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>฿${item.price.toFixed(2)}</td>
        <td>฿${itemTotalPrice.toFixed(2)}</td>
      </tr>
    `;
  }

  receiptContent += `
      </tbody>
    </table>
    <p><strong>Total Price: ฿${totalPrice.toFixed(2)}</strong></p>
    <div class="receipt-footer">
      <p>Thank you for shopping with IHASCOM SHOP!</p>
      <p>For inquiries, contact support@ihascomshop.com</p>
    </div>
  `;

  return receiptContent;
}
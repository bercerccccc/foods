document.getElementById("checkBtn").addEventListener("click", checkProduct);

function checkProduct() {
  const barcode = document.getElementById("barcodeInput").value.trim();
  const resultDiv = document.getElementById("result");
  const errorDiv = document.getElementById("error");

  resultDiv.style.display = "none";
  errorDiv.textContent = "";

  if (!barcode) {
    errorDiv.textContent = "Введите штрих‑код";
    return;
  }

  fetch("products.json")
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.barcode === barcode);

      if (!product) {
        errorDiv.textContent = "❌ Продукт не найден";
        saveToHistory({
          barcode,
          found: false
        });
        return;
      }

      const now = new Date();
      const expiry = new Date(product.expiryDate);
      const expired = expiry < now;

      let html = `<h2>🧾 ${product.name}</h2>`;
      html += `<p>${expired ? "⚠️ <b>Просрочен</b>" : "✅ <b>Срок годности в норме</b>"}</p>`;
      html += product.allergens.length > 0
        ? `<p>🚫 <b>Аллергены:</b> ${product.allergens.join(", ")}</p>`
        : `<p>🌿 <b>Безопасен для аллергиков</b></p>`;
      html += `<p>${product.restrictions.diabetic ? "🚫 <b>Не рекомендуется диабетикам</b>" : "✅ <b>Можно диабетикам</b>"}</p>`;

      resultDiv.innerHTML = html;
      resultDiv.style.display = "block";

      saveToHistory({
        barcode,
        found: true,
        name: product.name,
        expired,
        allergens: product.allergens,
        diabetic: product.restrictions.diabetic,
        time: new Date().toLocaleString()
      });
    });
}


function saveToHistory(item) {
  let history = JSON.parse(localStorage.getItem("scanHistory")) || [];
  history.unshift(item);
  history = history.slice(0, 50);
  localStorage.setItem("scanHistory", JSON.stringify(history));
}



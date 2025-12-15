window.addEventListener("DOMContentLoaded", loadProducts);

function loadProducts() {
  const list = document.getElementById("productList");
  const history = JSON.parse(localStorage.getItem("scanHistory")) || [];

  if (history.length === 0) {
    list.innerHTML = "<p>История пуста</p>";
    return;
  }

  history.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "product-card";

    if (!item.found) {
      li.innerHTML = `
        <h3>Штрих‑код: ${item.barcode}</h3>
        <p>❌ Продукт не найден</p>
        <small>${item.time}</small>
      `;
    } else {
      li.innerHTML = `
        <h3>${item.name}</h3>
        <p><b>Штрих‑код:</b> ${item.barcode}</p>
        <small>${item.time}</small><br>
        <button onclick="openDetails(${index})">Подробнее</button>
      `;
    }

    list.appendChild(li);
  });
}

function openDetails(index) {
  const history = JSON.parse(localStorage.getItem("scanHistory")) || [];
  const item = history[index];

  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");

  modalBody.innerHTML = `
    <h2>${item.name}</h2>
    <p><b>Штрих‑код:</b> ${item.barcode}</p>
    <p>${item.expired ? "⚠️ Просрочен" : "✅ Срок годности в норме"}</p>
    <p>${item.allergens.length ? "🚫 Аллергены: " + item.allergens.join(", ") : "🌿 Безопасен для аллергиков"}</p>
    <p>${item.diabetic ? "🚫 Не рекомендуется диабетикам" : "✅ Можно диабетикам"}</p>
    <small>${item.time}</small>
  `;

  modal.style.display = "block";
}


document.getElementById("closeModal").onclick = () => {
  document.getElementById("modal").style.display = "none";
};

window.onclick = (e) => {
  if (e.target === document.getElementById("modal")) {
    document.getElementById("modal").style.display = "none";
  }
};





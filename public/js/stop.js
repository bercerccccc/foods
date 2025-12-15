document.getElementById("scannerForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // ✅ ОТМЕНА ПЕРЕЗАГРУЗКИ

    const pinkod = document.getElementById("barcodeInput").value;
    const userId = document.querySelector("input[name='userId']").value;

    const res = await fetch("/main/scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinkod, userId })
    });

    const data = await res.json();

    const result = document.getElementById("result");
    const error = document.getElementById("error");

    if (data.error) {
        result.innerHTML = "";
        error.textContent = data.error;
        return;
    }

    error.textContent = "";
    result.innerHTML = `
        <p><b>Название:</b> ${data.product.tovarName}</p>
        <p><b>Аллергик:</b> ${data.product.allergic}</p>
        <p><b>Диабетик:</b> ${data.product.diabetic}</p>
        <p><b>Состав:</b> ${data.product.sostav}</p>
        <p><b>Экологичность:</b> ${data.product.ecologic}</p>
        <p><b>Вред природе:</b> ${data.product.vredNature}</p>
    `;
});
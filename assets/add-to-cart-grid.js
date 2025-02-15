function initProductCardForms() {
    const forms = document.querySelectorAll(".js-product-card-form");

        forms.forEach((form) => {
        const quantityInput = form.querySelector(".product-card__form-quantity-input");
        const decreaseBtn = form.querySelector("[data-action='decrease']");
        const increaseBtn = form.querySelector("[data-action='increase']");


        const updateQuantity = (change) => {
            let currentValue = parseInt(quantityInput.value);
            let newValue = currentValue + change;
            if (newValue < 1) newValue = 1;  // Previene valores negativos
            quantityInput.value = newValue;
        };

        decreaseBtn.addEventListener("click", () => updateQuantity(-1));

        increaseBtn.addEventListener("click", () => updateQuantity(1));


        quantityInput.addEventListener("input", function () {
            if (parseInt(this.value, 10) < 1 || isNaN(this.value)) {
                this.value = 1;
            }
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault(); 
            

            if (parseInt(quantityInput.value) > 0) {
               

                const formData = new FormData(form);
                formData.append("quantity", parseInt(quantityInput.value)); 

                fetch("/cart/add.js", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: form.querySelector("input[name='id']").value,
                        quantity: parseInt(quantityInput.value),
                    }),
                })
                    .then(response => response.json())
                    .then(data => {
                        window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.GET_CART, { noOpen: true });
                        window.themeCore.EventBus.emit("cart:drawer:open");
                    })
                    .catch(error => {
                       console.error("Error to addding prooduct", error);
                    })
                    .finally(() => {
                       
                        
                    });
                  
            }
        });

    });
}

// Ejecutar la función cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", initProductCardForms);

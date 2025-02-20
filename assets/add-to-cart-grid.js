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

        async function emitCartEvent(variantId, quantity) {
            try {
              await window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.ADD_TO_CART, {
                id: variantId,
                quantity: quantity
              });
              await window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.GET_CART);
            } catch (error) {
              onQuantityError(error);
              
            }
          }
        function onQuantityError(error) {
            const CartNotificationError = window.themeCore.CartNotificationError;
            CartNotificationError.addNotification(error.description);
            CartNotificationError.open();
        }
        
        form.addEventListener("submit", async function (event) {
            event.preventDefault(); 
            

            if (parseInt(quantityInput.value) > 0) {
               

                const formData = new FormData(form);
                formData.append("quantity", parseInt(quantityInput.value)); 
                
                await emitCartEvent(form.querySelector("input[name='id']").value, quantityInput.value);
                  
            }
        });

    });
}

document.addEventListener("DOMContentLoaded", initProductCardForms);

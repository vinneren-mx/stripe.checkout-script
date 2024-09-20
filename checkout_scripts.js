// WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE. THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.

document.addEventListener("DOMContentLoaded", function() {
  console.log("Version 13")

  const checkAndExecute = () => {
    const orderFormView = document.querySelector(".container-order-form");
    if (!orderFormView) return;          
    
    const boxButton = document.querySelector("#payment-data-submit");

    if (!boxButton) {
      console.log("No se encontró el botón de confirmación de pago.");
      return;
    }

    const listButtons = document.querySelector(".payment-group-list-btn");
    const stripeButton = document.querySelector("#payment-group-StripePaymentGroup");
    if (!stripeButton) {
      console.log("No se encontró el botón de Stripe.");
      return;
    }

    const boxStripe = document.querySelector(".steps-view");
    if (!boxStripe) {
      console.log("No se encontró la vista de pasos.");
      return;
    }

    const isOnlyStripePayment = listButtons.children.length === 1;
    const isStripeActive = stripeButton.classList.contains("active");

    if (isOnlyStripePayment) {
      listButtons.style.display = "none";
      boxStripe.style.width = "95%";
      document
      boxButton.click();
              $(".payment-submit-wrap").css("display", "none");

        const modal = document.querySelector(".modal-payment-template");
        modal.style.display = "none";
        const modalBackground = document.querySelector(".modal-backdrop");
        modalBackground.style.display = "none";

    } else {
      if (isStripeActive) {
        boxButton.click();
        $(".payment-submit-wrap").css("display", "none");

        const modal = document.querySelector(".modal-payment-template");
        modal.style.display = "none";
        const modalBackground = document.querySelector(".modal-backdrop");
        modalBackground.style.display = "none";
      } else {
        $(".payment-submit-wrap").css("display", "block");

      }
    }
  };
                          	

  // Ejecutar inicialmente cuando se cargue el DOM
  checkAndExecute();


  // Observar cambios en el DOM para detectar navegación
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      checkAndExecute();
    });
  });

  // Configurar el observador para observar cambios en el cuerpo del documento
  observer.observe(document.body, { childList: true, subtree: true });
});


window.addEventListener("load", function() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            let activeMethod = document.querySelector(".payment-group-item.active");
            if (!activeMethod) return;
            activeMethod = activeMethod.textContent.trim();
            console.log("Método de pago activo al cargar:", activeMethod);

            let stripeSelected = false;
            if (activeMethod === "Stripe") {
                stripeSelected = true;
            }

            const listButtons = document.querySelector(".payment-group-list-btn");
            if (!listButtons) {
                console.log("No se encontró el contenedor de métodos de pago.");
                return;
            }

            const paymentButtons = listButtons.querySelectorAll(".payment-group-item");
            if (paymentButtons.length === 0) {
                console.log("No se encontraron botones de métodos de pago.");
                return;
            }

            paymentButtons.forEach(button => {
                button.addEventListener("click", function() {
                    const paymentMethod = button.textContent.trim();
                    console.log("Método de pago seleccionado:", paymentMethod);

                    // Verifica si se seleccionó Stripe
                    if (paymentMethod.toLowerCase().includes("stripe")) {
                        stripeSelected = true;
                    }

                    // Si Stripe fue seleccionado y ahora se selecciona otro método, recargar la página
                    if (stripeSelected && !paymentMethod.toLowerCase().includes("stripe")) {
                        setTimeout(() => {
                            location.reload();
                        }, 100);
                    }
                });
            });
        });
    });

    // Configurar el observer para observar cambios en el DOM
    observer.observe(document.body, { childList: true, subtree: true });

    // Se quita el setTimeout, ya que ahora el observer manejará la detección de cambios
});


//algo de aqui

// radar 

const clean = (email) => {
  // Elimina arrobas y puntos del correo electrónico
  return email.replace(/@/g, '').replace(/\./g, '');

}
window.addEventListener('load', function () {
  // Todo tu código aquí
  const interval = setInterval(async () => {
    try {
      const publik_key = "pk_test_51LIQXqL8STGutdEgQNRQhFEREyBvGaIWIo734r6Yf9rR9D6GuEIcmTH2kB9k8FAwSWcVY3pMjGPjJk1MOpLrSbTD00TxmuPc7d";

      // Initialize Stripe.js
      const stripe = Stripe(publik_key);

      // Clear the interval before executing the API call to prevent multiple executions
      clearInterval(interval);

      const { radarSession, error } = await stripe.createRadarSession();

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "id": String(clean(vtexjs.checkout.orderForm.clientProfileData.email)),
        "radar_session": radarSession.id
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("https://payments--stripe.myvtex.com/_v/stripe.payment-provider/v0/RadarSessions", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log('Result', result))
        .catch((error) => console.error('Error', error));
      console.log("Resultado de radar:", radarSession, "Error:::", error);


    } catch (e) {
      console.error('Error al crear la sesión de radar:', e);
    }
  }, 100);
});
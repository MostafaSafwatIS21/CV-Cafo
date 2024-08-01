document.addEventListener("DOMContentLoaded", function() {
  const codeInput = document.getElementById("discountCode1");
  const form = document.forms["form1"];
  const checkbox = document.getElementById("text-ae42");

  codeInput.addEventListener("input", function() {
    checkbox.value = codeInput.value;
    if (codeInput.value.length === 8) {
      form.submit();
    }
  });

  checkbox.addEventListener("input", function() {
    if (checkbox.value.length > 8) {
      checkbox.value = checkbox.value.slice(0, 8);
    }
    codeInput.value = checkbox.value;
    if (checkbox.value.length === 8) {
      form.submit();
    }
  });
});

document.getElementById("responseFrame1").onload = function() {
  var iframe = document.getElementById("responseFrame1");
  var responseText;

  // Access the iframe's document and get the response text
  try {
    if (iframe.contentDocument) {
      responseText = iframe.contentDocument.body.innerText;
    } else if (iframe.contentWindow) {
      responseText = iframe.contentWindow.document.body.innerText;
    } else {
      throw new Error("Unable to access iframe content");
    }

    if (responseText) {
      try {
        var response = JSON.parse(responseText);

        if (response.status === "success") {
          showAlert(response.message, "alert alert-success show");
          // Update the discount value in the table cell
          document
            .querySelectorAll(".discountValue")
            .forEach(function(element) {
              element.textContent = response.data.coupon.value + "%";
            });

          let discount = document.querySelector(".discountValue").textContent;
          discount = parseInt(discount);
          let price = document.querySelector(".originalPrice").textContent;
          price = parseInt(price);
          let finalPrice = price - (discount / 100) * price;
          document.querySelectorAll(".finalPrice").forEach(function(element) {
            element.textContent = finalPrice.toFixed(2) + "$";
          });
          document.getElementById("Discount").textContent =
            (discount / 100) * price;
        } else {
          showAlert(response.message, "alert alert-error show");
        }
      } catch (e) {
        showAlert(
          "Error parsing response: " + responseText,
          "alert alert-error show"
        );
      }
    } else {
      showAlert(
        "No response received. Please try again.",
        "alert alert-error show"
      );
    }
  } catch (error) {
    console.error("Error accessing iframe content:", error);
    showAlert(
      "An error occurred while processing the response.",
      "alert alert-error show"
    );
  }
};

function showAlert(message, className) {
  var alertElement = document.createElement("div");
  alertElement.textContent = message;
  alertElement.className = className;

  document.body.appendChild(alertElement);

  window.setTimeout(function() {
    alertElement.classList.add("hide");
    window.setTimeout(function() {
      alertElement.parentNode.removeChild(alertElement);
    }, 2000);
  }, 3000);
}

//
document.addEventListener("DOMContentLoaded", function() {
  const nameSelect = document.getElementById("select-04be");
  const durationSelect = document.getElementById("select-f4ae");

  function updateTable() {
    let name = nameSelect.value;
    let duration = durationSelect.value;

    fetch(`/api/price-plan/getPricing?name=${name}&duration=${duration}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        name === "Pro" ? (name = "أساسي") : (name = "بريميوم");
        duration === "month" ? (duration = "شهري") : (duration = "سنوي");
        document.getElementById("typeName").textContent = `${name} ${duration}`;
        document.getElementById("cvCount").textContent =
          data.plan.features[0].quantity;
        document.getElementById("coverLetterCount").textContent =
          data.plan.features[1].quantity;
        document.getElementById("emailCount").textContent =
          data.plan.features[4].quantity;
        document.getElementById("webCount").textContent =
          data.plan.features[3].quantity;

        const jobTrackQuantity = data.plan.features[2].quantity;
        const jobTrackImage = document.getElementById("jobTrackImage");
        if (jobTrackQuantity > 0) {
          jobTrackImage.src = "Layout/images/1634264.png";
        } else {
          jobTrackImage.src = "Layout/images/32178.png";
        }

        document.querySelectorAll(".originalPrice").forEach(function(element) {
          element.textContent = data.plan.price + "$";
        });

        let discount = document.querySelector(".discountValue").textContent;
        discount = parseInt(discount);
        console.log(discount);

        let finalPrice = data.plan.price - (discount / 100) * data.plan.price;
        document.querySelectorAll(".finalPrice").forEach(function(element) {
          element.textContent = finalPrice.toFixed(2) + "$";
        });
        document.getElementById("Discount").textContent =
          (discount / 100) * data.plan.price;
      })

      .catch((error) => console.error("Error fetching pricing data:", error));
  }

  nameSelect.addEventListener("change", updateTable);
  durationSelect.addEventListener("change", updateTable);

  // Initial update
  updateTable();
});

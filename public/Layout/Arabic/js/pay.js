document.getElementById("responseFrame").onload = function() {
  var iframe = document.getElementById("responseFrame");
  var responseText;

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
        console.log("Parsed Response:", response);

        if (response.paymentUrl) {
          showAlert("Redirecting to payment...", "alert alert-success show");
          window.setTimeout(function() {
            window.location.href = response.paymentUrl;
          }, 1000);
        } else if (response.status === "error") {
          // Display error message from backend
          showAlert(response.message, "alert alert-error show");
        } else {
          showAlert(response.message, "alert alert-error show");
        }
      } catch (e) {
        showAlert(
          "Error parsing response: " + e.message,
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

  // Add the alert to the DOM
  document.body.appendChild(alertElement);

  // Automatically remove the alert after a delay
  window.setTimeout(function() {
    alertElement.classList.remove("show");
    window.setTimeout(function() {
      alertElement.parentNode.removeChild(alertElement);
    }, 2000);
  }, 3000);
}

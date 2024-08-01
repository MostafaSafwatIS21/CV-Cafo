document.getElementById("responseFrame").onload = function() {
  var iframe = document.getElementById("responseFrame");
  var responseText;
  var url = iframe.dataset.url;

  // Access the iframe's document and get the response text
  if (iframe.contentDocument) {
    responseText = iframe.contentDocument.body.innerText;
  } else if (iframe.contentWindow) {
    // For older browsers
    responseText = iframe.contentWindow.document.body.innerText;
  }

  // Debugging logs
  console.log("Response Text:", responseText);
  console.log(
    "Iframe content:",
    iframe.contentDocument
      ? iframe.contentDocument.body.innerHTML
      : "No content"
  );

  if (responseText) {
    try {
      var response = JSON.parse(responseText);
      console.log("Parsed Response:", response);
      if (response.status === "success") {
        showAlert(response.message, "alert alert-success show");
        window.setTimeout(function() {
          if (response.token) {
            window.location.href =
              `/${url}?token=` + encodeURIComponent(response.token);
          } else if (url) {
            window.location.href = `/${url}`;
          }
        }, 1000);
      } else {
        // Display error message
        showAlert(response.message, "alert alert-error show");
      }
    } catch (e) {
      // Display parsing error
      showAlert(
        "Error parsing response: " + responseText,
        "alert alert-error show"
      );
    }
  } else {
    // Display no response text error
    showAlert(
      "Something went wrong! Please try again.",
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

  // Automatically remove the alert after a delay (e.g., 3 seconds)
  window.setTimeout(function() {
    alertElement.classList.remove("show");
    window.setTimeout(function() {
      alertElement.parentNode.removeChild(alertElement);
    }, 2000); // Wait for the transition to end before removing the element
  }, 2000); // Adjust the timeout delay as needed
}

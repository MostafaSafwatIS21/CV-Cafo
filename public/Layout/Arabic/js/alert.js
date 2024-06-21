document.getElementById("responseFrame").onload = function() {
  var iframe = document.getElementById("responseFrame");
  var responseText;
  var url = iframe.dataset.url;
  console.log("URL:", url);
  // Access the iframe's document and get the response text
  if (iframe.contentDocument) {
    responseText = iframe.contentDocument.body.innerText;
  } else if (iframe.contentWindow) {
    // For older browsers
    responseText = iframe.contentWindow.document.body.innerText;
  }

  // // Debugging logs
  // console.log('Response Text:', responseText);
  // console.log('Iframe content:', iframe.contentDocument ? iframe.contentDocument.body.innerHTML : 'No content');

  if ((responseText, url)) {
    try {
      var response = JSON.parse(responseText);
      // console.log('Parsed Response:', response);
      if (response.status === "success") {
        showAlert(response.message, "alert-success");
        window.setTimeout(function() {
          if (response.token) {
            console.log("Token:", response.token);
            window.location.href =
              `/${url}?token=` + encodeURIComponent(response.token);
          } else {
            window.location.href = url;
          }
        }, 2000);
      } else {
        // Display error message in the div
        var errorMessageDiv = document.getElementById("errorMessage");
        errorMessageDiv.style.display = "block";
        errorMessageDiv.innerText = response.message;
      }
    } catch (e) {
      var errorMessageDiv = document.getElementById("errorMessage");
      errorMessageDiv.style.display = "block";
      errorMessageDiv.innerText = "Error parsing response: " + responseText;
      // showAlert('Error parsing response: ' + responseText, 'alert-error');
    }
  } else {
    // Display error message in the div for no response text
    var errorMessageDiv = document.getElementById("errorMessage");
    errorMessageDiv.style.display = "block";
    errorMessageDiv.innerText = "something went wrong! please try again.";
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
    alertElement.parentNode.removeChild(alertElement);
  }, 3000); // Adjust the timeout delay as needed
}

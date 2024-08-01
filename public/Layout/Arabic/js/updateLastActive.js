setInterval(() => {
  fetch("/update-last-active", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((error) => console.error("Error updating last active:", error));
}, 5 * 60 * 1000); // 5 minutes in milliseconds

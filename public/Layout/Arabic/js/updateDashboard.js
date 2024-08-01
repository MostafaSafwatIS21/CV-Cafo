document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("search-input");
  const userList = document.getElementById("user-list");
  const searchCouponInput = document.getElementById("search-coupon");
  const couponList = document.getElementById("coupon-list");
  const currentAdminId = document
    .getElementById("current-admin")
    .getAttribute("data-admin-id");

  // Function to update lastActive data for users
  function updateLastActiveData() {
    fetch("/get-last-active-updates")
      .then((response) => response.json())
      .then((data) => {
        // Clear previous user rows
        userList.innerHTML = "";

        // Assuming res.locals.user contains the current user's information

        // Filter out the current user from the data
        const filteredUsers = data.filter(
          (user) => user._id !== currentAdminId
        );

        // Render each user in the filtered list
        filteredUsers.forEach((user) => {
          const userRow = document.createElement("tr");
          userRow.id = `user-${user._id}`;
          userRow.style.height = "61px";
          userRow.innerHTML = `
                        <td class="u-align-center u-table-cell u-table-cell-5">${user.lastActive}</td>
                        <td class="u-align-center u-table-cell u-table-cell-6">${user.pricingPlan.price}</td>
                        <td class="u-align-center u-table-cell u-table-cell-7">${user.pricingPlan.name}</td>
                        <td class="u-table-cell u-table-cell-8">${user.name}</td>
                    `;
          userList.appendChild(userRow);
        });
      })
      .catch((error) =>
        console.error("Error fetching lastActive updates:", error)
      );
  }

  // Fetch and update lastActive data every 5 minutes
  setInterval(updateLastActiveData, 5 * 60 * 1000); // 5 minutes in milliseconds

  // Initial fetch when the page loads
  updateLastActiveData();

  // Search functionality (if needed)
  searchInput.addEventListener("input", function() {
    const searchValue = this.value.toLowerCase();
    const rows = userList.getElementsByTagName("tr");
    Array.from(rows).forEach((row) => {
      const userName = row
        .querySelector(".u-table-cell-8")
        .textContent.toLowerCase();
      row.style.display = userName.includes(searchValue) ? "" : "none";
    });
  });
});

//
document.addEventListener("DOMContentLoaded", function() {
  const searchCouponInput = document.getElementById("search-coupon");
  const couponList = document.getElementById("coupon-list");

  // Function to update lastActive data for users
  function getCoupons() {
    fetch("/api/coupon/get-coupons", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        // Check if data has a 'coupons' property that is an array

        // Clear previous user rows
        couponList.innerHTML = "";

        data.coupons.forEach((coupon) => {
          const expirationDate = new Date(coupon.expirationDate);
          const isExpired = expirationDate < Date.now();
          const formattedDate = expirationDate.toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const couponRow = document.createElement("tr");
          couponRow.id = `coupon-${coupon._id}`;
          couponRow.style.height = "61px";
          couponRow.setAttribute("onclick", "togglecode2(event)");
          couponRow.innerHTML = `
            <td class="u-align-center u-table-cell u-table-cell-5">${
              isExpired ? "منتهي" : "ساري"
            }</td>

                    <td class="u-align-center u-table-cell u-table-cell-6">%${
                      coupon.value
                    }</td>
                    <td class="u-align-center u-table-cell u-table-cell-7">${formattedDate}</td>
                    <td class="u-table-cell u-table-cell-8">${coupon.code}</td>
                `;
          couponList.appendChild(couponRow);
        });
      })
      .catch((error) =>
        console.error("Error fetching lastActive updates:", error)
      );
  }

  getCoupons();

  searchCouponInput.addEventListener("input", function() {
    const searchValue = this.value.toLowerCase();
    const rows = couponList.getElementsByTagName("tr");
    Array.from(rows).forEach((row) => {
      const couopnName = row
        .querySelector(".u-table-cell-8")
        .textContent.toLowerCase();
      row.style.display = couopnName.includes(searchValue) ? "" : "none";
    });
  });
});

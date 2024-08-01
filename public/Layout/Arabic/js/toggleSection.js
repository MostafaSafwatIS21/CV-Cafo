// scripts.js
function toggleSection(sectionNumber) {
  for (let i = 1; i <= 6; i++) {
    let section = document.getElementById(`section${i}`);
    if (i === sectionNumber) {
      section.classList.remove("hidden");
    } else {
      section.classList.add("hidden");
    }
  }
}

function details(detailsNumber) {
  var form1 = document.getElementById("form1");
  var form2 = document.getElementById("form2");
  var form3 = document.getElementById("form3");
  var form4 = document.getElementById("form4");
  for (let i = 1; i <= 4; i++) {
    let details = document.getElementById(`details${i}`);
    if (i === detailsNumber) {
      details.classList.remove("hidden");
    } else {
      details.classList.add("hidden");
      form1.classList.add("hidden");
      form2.classList.add("hidden");
      form3.classList.add("hidden");
      form4.classList.add("hidden");
    }
  }
}

function form1() {
  var form1 = document.getElementById("form1");
  if (form1.classList.contains("hidden")) {
    form1.classList.remove("hidden");
  } else {
    form1.classList.add("hidden");
  }
}

function form2() {
  var form2 = document.getElementById("form2");
  if (form2.classList.contains("hidden")) {
    form2.classList.remove("hidden");
  } else {
    form2.classList.add("hidden");
  }
}

function form3() {
  var form3 = document.getElementById("form3");
  if (form3.classList.contains("hidden")) {
    form3.classList.remove("hidden");
  } else {
    form3.classList.add("hidden");
  }
}

function form4() {
  var form4 = document.getElementById("form4");
  if (form4.classList.contains("hidden")) {
    form4.classList.remove("hidden");
  } else {
    form4.classList.add("hidden");
  }
}

function togglerow1() {
  var formclient1 = document.getElementById("formclient1");
  if (formclient1.classList.contains("hidden")) {
    formclient1.classList.remove("hidden");
  } else {
    formclient1.classList.add("hidden");
  }
}

function togglecode1() {
  var formcode1 = document.getElementById("formcode1");
  var formcode2 = document.getElementById("formcode2");
  if (formcode1.classList.contains("hidden")) {
    formcode1.classList.remove("hidden");
    formcode2.classList.add("hidden");
  } else {
    formcode1.classList.add("hidden");
  }
}

//coupons
let activeRow = null;

function togglecode2(event) {
  const clickedRow = event.currentTarget;

  var couponId = event.currentTarget.id.split("-")[1];
  let couopnForm = document.getElementById("couopnForm");
  const couponCodeCell = clickedRow.querySelector(
    ".u-table-cell.u-table-cell-8"
  );
  couopnForm.action = `/api/coupon/update-coupon/${couponId}`;

  if (activeRow === clickedRow) {
    document.getElementById("formcode1").classList.add("hidden");
    document.getElementById("formcode2").classList.add("hidden");
    activeRow = null;
  } else {
    const couponDataCell = clickedRow.querySelector(
      ".u-table-cell.u-table-cell-7"
    );
    const couponValueCell = clickedRow.querySelector(
      ".u-table-cell.u-table-cell-6"
    );
    const couponStateCell = clickedRow.querySelector(
      ".u-table-cell.u-table-cell-5"
    );

    document.getElementById("couponCode").textContent =
      couponCodeCell.textContent;
    document.getElementById("couponExpireDate").textContent =
      couponDataCell.textContent;
    document.getElementById("couponValue").textContent =
      couponValueCell.textContent;
    document.getElementById("couponState").textContent =
      couponStateCell.textContent;

    document.getElementById("formcode1").classList.add("hidden");
    document.getElementById("formcode2").classList.remove("hidden");

    if (activeRow && activeRow !== clickedRow) {
      activeRow.classList.remove("active");
    }

    activeRow = clickedRow;
  }
}

function togglecodewrite1() {
  var codewrite1 = document.getElementById("codewrite1");
  var codewrite = document.getElementById("text-ae42");
  var codewrite2 = document.getElementById("cardNumberInput");
  if (codewrite1.classList.contains("hidden")) {
    codewrite1.classList.remove("hidden");
    codewrite.classList.remove("hidden");
    codewrite2.classList.remove("hidden");
  } else {
    codewrite1.classList.add("hidden");
    codewrite.classList.add("hidden");
    codewrite2.classList.add("hidden");
  }
}

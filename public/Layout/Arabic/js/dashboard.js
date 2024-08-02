// Initiate the dialog box
document.addEventListener("DOMContentLoaded", function() {
  const dialogLinks = document.querySelectorAll(".u-dialog-link");
  const dialogImage = document.getElementById("dialogImage");
  const templateContent = document.getElementById("templateContent");

  dialogLinks.forEach((link) => {
    link.addEventListener("click", function() {
      const imageUrl = this.getAttribute("src");
      const templateName = this.getAttribute("alt");
      dialogImage.setAttribute("src", imageUrl);
      templateContent.textContent = templateName;
    });
  });
});

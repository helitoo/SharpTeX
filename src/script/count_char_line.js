/*document.addEventListener("DOMContentLoaded", () => {
  // Get page
  const page = document.getElementById("page");
  const pChar = document.getElementById("char");
  const pLine = document.getElementById("line");

  // Event page was changed
  page.addEventListener("input", () => {
    pChar.innerText = page.value.length;
    let lines = page.value.match(/\n/g);
    pLine.innerText = (lines ? lines.length : 0) + 1;
  });
});*/

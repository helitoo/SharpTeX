document.addEventListener("DOMContentLoaded", function () {
  //===================================
  // Get pattern and replacement
  //===================================

  let page = document.getElementById("page"),
    currentIndex,
    matches = [],
    pattern,
    replacement;

  // Get pattern and match
  // Update value when input text was changed
  document.getElementById("find").addEventListener("input", function () {
    let string = this.value;
    let modifiers = "sgu";
    if (document.getElementById("ignoreCase").checked) {
      modifiers += "i";
    }
    pattern = new RegExp(string, modifiers);
    matches = [...page.value.matchAll(pattern)];
    currentIndex = 0;
  });

  // Get replacement
  // Update value when input text was changed
  document.getElementById("replace").addEventListener("input", function () {
    replacement = this.value;
  });

  page.addEventListener("input", function () {
    matches = [...page.value.matchAll(pattern)]; // The content was changed by hand by user
    if (matches.length > 0) {
      currentIndex = Math.min(
        Math.max(currentIndex - 1, 0),
        matches.length - 1
      );
    }
  });

  // Highlighting matching at currenc index
  function highlightMatch() {
    if (matches.length != 0) {
      let start = matches[currentIndex].index;
      let end = start + matches[currentIndex][0].length;

      // Highlighting
      page.focus();
      page.setSelectionRange(start, end);
      let lineHeight = 20;
      let position = page.scrollHeight * (start / page.value.length);
      page.scrollTop = position - lineHeight * 2;
    }
  }

  //===================================
  // Event when user click on these buttons
  //===================================

  const backButton = document.getElementById("backButton"),
    nextButton = document.getElementById("nextButton"),
    findButton = document.getElementById("findButton"),
    replaceAllButton = document.getElementById("replaceAllButton"),
    replaceOneButton = document.getElementById("replaceOneButton");

  // Turn back from current index
  backButton.addEventListener("click", () => {
    if (matches && currentIndex < 0) {
      alert("Đã hết chuỗi khớp!");
    } else if (matches.length != 0) {
      currentIndex--;
      highlightMatch();
    }
  });

  // Go next from current index
  nextButton.addEventListener("click", () => {
    if (currentIndex > matches.length - 1) {
      alert("Đã hết chuỗi khớp!");
    } else if (matches.length != 0) {
      currentIndex++;
      highlightMatch();
    }
  });

  // Event find
  findButton.addEventListener("click", () => {
    if (matches.length == 0) {
      alert("Không tìm thấy!");
    } else {
      highlightMatch();
    }
  });

  // Event replace all
  replaceAllButton.addEventListener("click", () => {
    if (matches.length == 0) {
      alert("Không tìm thấy!");
    } else {
      page.value = page.value.replace(pattern, replacement);
      alert("Đã thay thế toàn bộ!");
    }
    matches = [...page.value.matchAll(pattern)];
  });

  // Event replace one time
  replaceOneButton.addEventListener("click", () => {
    if (matches.length == 0) {
      alert("Không tìm thấy!");
    } else {
      let match = matches[currentIndex];
      highlightMatch();

      let start = match.index;
      let end = start + match[0].length;

      page.value =
        page.value.substring(0, start) +
        replacement +
        page.value.substring(end);

      matches = [...page.value.matchAll(pattern)]; // Update matches after replace

      if (matches.length > 0) {
        currentIndex = Math.min(currentIndex, matches.length - 1);
        highlightMatch();
      }
    }
  });
});

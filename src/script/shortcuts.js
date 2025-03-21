document.addEventListener("keydown", function (event) {
  if (event.ctrlKey) {
    switch (event.key) {
      case "o":
        event.preventDefault();
        document.getElementById("importButton").click();
        break;
      case "s":
        event.preventDefault();
        document.getElementById("saveButton").click();
        break;
      case "e":
        event.preventDefault();
        document.getElementById("exportButton").click();
        break;
      case "p":
        event.preventDefault();
        document.getElementById("prefButton").click();
        break;
      case "h":
        event.preventDefault();
        document.getElementById("findReplaceButton").click();
        break;
      case "d":
        event.preventDefault();
        document.getElementById("documentButton").click();
        break;
      default:
        if (event.shiftKey) {
          switch (event.key) {
            case "a":
              event.preventDefault();
              document.getElementById("aiButton").click();
              break;
            case "s":
              event.preventDefault();
              document.getElementById("settingsButton").click();
              break;
          }
        }
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const findReplaceWindow = document.getElementById("findNReplace");
  const findReplaceButton = document.getElementById("findReplaceButton");
  const closeFindReplaceButton = document.getElementById("closeFindNReplace");

  let offsetX = 0,
    offsetY = 0,
    isDragging = false;

  // default position of window
  function centerWindow() {
    findReplaceWindow.style.position = "fixed";
    findReplaceWindow.style.top = `${
      (window.innerHeight - findReplaceWindow.offsetHeight) / 2
    }px`;
    findReplaceWindow.style.left = `${
      (window.innerWidth - findReplaceWindow.offsetWidth) / 2
    }px`;
  }
  window.addEventListener("resize", centerWindow);

  centerWindow();

  // open window
  findReplaceButton.addEventListener("click", function () {
    findReplaceWindow.style.display = "block";
    centerWindow();
  });

  // close window
  closeFindReplaceButton.addEventListener("click", function () {
    findReplaceWindow.style.display = "none";
  });

  // drag window
  findReplaceWindow.addEventListener("mousedown", function (event) {
    isDragging = true;
    offsetX = event.clientX - findReplaceWindow.offsetLeft;
    offsetY = event.clientY - findReplaceWindow.offsetTop;
  });

  // move window
  document.addEventListener("mousemove", function (event) {
    if (isDragging) {
      findReplaceWindow.style.left = `${event.clientX - offsetX}px`;
      findReplaceWindow.style.top = `${event.clientY - offsetY}px`;
    }
  });

  // stop moving window
  document.addEventListener("mouseup", function () {
    isDragging = false;
  });
});

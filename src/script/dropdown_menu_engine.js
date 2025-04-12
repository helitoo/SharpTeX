function dropdown(id) {
  document.getElementById(id).classList.toggle("show"); // Add or remove class show
}

function hindDropdown(event) {
  const clickedElementID = event.target.id;

  const dropdowns = [
    { id: "titlepageDropdown", button: "titlepageButton" },
    { id: "prefDropdown", button: "prefButton" },
  ];

  dropdowns.forEach(({ id, button }) => {
    if (clickedElementID !== button) {
      let dropdownMenu = document.getElementById(id);
      if (dropdownMenu) dropdownMenu.classList.remove("show");
    }
  });
}

function insertToBeginOfPage(text) {
  toPage(text + getText(page.state.doc));

  // Activate event input to count char and line
  // page.dispatchEvent(new Event("input"));
}

function insertToEndOfPage(text) {
  toPage(getText(page.state.doc) + text);

  // Activate event input to count char and line
  // page.dispatchEvent(new Event("input"));
}

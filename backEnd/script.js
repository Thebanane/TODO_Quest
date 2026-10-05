const list = document.getElementById("toDoList");
const form = document.getElementById("toDoForm");

const stored = localStorage.getItem("data");
let TODOs = stored ? JSON.parse(stored) : [];

function save() {
  localStorage.setItem("data", JSON.stringify(TODOs));
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function buildInHTML() {
  list.innerHTML = TODOs.map((todo) =>
    `<li id="${todo.id}">${escapeHTML(todo.title)}<button aria-label="Complete" class="button-complete"></button></li>`
  ).join("");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = event.target.elements.todo.value.trim();
  if (!title) return;

  TODOs.push({ title, completed: false, id: crypto.randomUUID() });
  save();
  buildInHTML();
  event.target.reset();
});

list.addEventListener("click", (event) => {
  const button = event.target.closest(".button-complete");
  if (!button) return;

  const id = button.parentElement.id;
  TODOs = TODOs.filter((todo) => todo.id !== id);
  save();
  buildInHTML();
});

buildInHTML();
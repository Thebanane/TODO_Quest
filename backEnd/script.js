const list = document.getElementById("toDoList");
const form = document.getElementById("toDoForm");
const input = document.getElementById("toDoInput");
const progressBar = document.getElementById("progressBar");
const progressCount = document.getElementById("progressCount");
const victory = document.getElementById("victory");

const STORAGE_KEY = "data-" + todayKey();
const stored = localStorage.getItem(STORAGE_KEY);
let TODOs = stored ? JSON.parse(stored) : [];

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(TODOs));
}

function renderProgress(){
  const total = TODOs.length;
  const done = TODOs.filter((todo) => todo.completed).length;
  
  progressBar.innerHTML = "";
  for(let i = 0; i < total; i += 1) {
    const block = document.createElement("div");
    block.className = "block";
    if (i < done) {
      block.classList.add("filled");
    }
    progressBar.appendChild(block)
  }

  progressCount.textContent = `${done}/${total} QUESTS`;
  victory.hidden = !(total > 0 && done === total);
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function buildInHTML() {
  list.innerHTML = TODOs.map((todo) =>
    `<li id="${todo.id}" class="${todo.completed ? "done" : ""}">${escapeHTML(todo.title)}<button aria-label="Complete" class="button-complete">Complete</button><button aria-label="Delete" class="button-delete">Delete</button></li>`).join("");
  renderProgress();
}

function todayKey(){
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = input.value.trim();
  if (!title) return;

  TODOs.push({ title, completed: false, id: crypto.randomUUID() });
  save();
  buildInHTML();
  event.target.reset();
});

list.addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return;
  const id = li.id;

  if (event.target.closest(".button-complete")) {
    const todo = TODOs.find((t) => t.id === id);
    if (todo) todo.completed = !todo.completed;
  } else if (event.target.closest(".button-delete")) {
    TODOs = TODOs.filter((t) => t.id !== id);
  } else {
    return;
  }

  save();
  buildInHTML();
});
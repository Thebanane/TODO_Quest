const list = document.getElementById("toDoList");
const form = document.getElementById("toDoForm");
const input = document.getElementById("toDoInput");
const progressBar = document.getElementById("progressBar");
const progressCount = document.getElementById("progressCount");
const victory = document.getElementById("victory");
const progressFill = document.createElement("div");


const STORAGE_KEY = "data-" + todayKey();
const stored = localStorage.getItem(STORAGE_KEY);
let TODOs = stored ? JSON.parse(stored) : [];

progressFill.id = "progressFill";
progressBar.appendChild(progressFill);

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(TODOs));
}

function renderProgress(){
  const total = TODOs.length;
  const done = TODOs.filter((todo) => todo.completed).length;
  const percent = total === 0 ? 0 : done / total;

  progressFill.style.width = `${percent * 100}%`;
  progressBar.className = percent < 0.33 ? "low" : percent < 0.66 ? "mid" : "high";

  progressCount.textContent = `${done}/${total} QUESTS`;
  victory.hidden = !(total > 0 && done === total);
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function buildInHTML() {
  list.innerHTML = TODOs.map((todo) => `
    <li id="${todo.id}" class="${todo.completed ? "done" : ""}">
      <span class="title">${escapeHTML(todo.title)}</span>
      <div class="actions">
        <button class="btn btn-complete button-complete">Complete</button>
        <button class="btn btn-delete button-delete">Delete</button>
      </div>
    </li>`).join("");
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
  list.lastElementChild.classList.add("enter");
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
    if (li.classList.contains("leave")) return; // already leaving, ignore extra clicks

    const remove = () => {
      TODOs = TODOs.filter((t) => t.id !== id);
      save();
      buildInHTML();
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      remove(); // no animation, so animationend would never fire
      return;
    }

    li.classList.remove("enter");
    li.classList.add("leave");
    li.addEventListener("animationend", remove, { once: true });
    return;
  } else {
    return;
  }

  save();
  buildInHTML();
});
const formDOM = document.querySelector(".form");
const formInput = document.querySelector(".form__input");
const todoList = document.querySelector(".todoList");
const list = document.querySelector(".list");
const toggleBtn = document.querySelector(".header__toggle");
const inputBtn = document.querySelector(".button");
const body = document.body;
const whole = document.querySelector(".whole");

const toggleFunction = () => {
  body.classList.toggle("light");
  formInput.classList.toggle("light");
  formInput.classList.toggle("dark");
  inputBtn.classList.toggle("light");
  inputBtn.classList.toggle("dark");
  list.classList.toggle("light");
  list.classList.toggle("dark");
  todoList.classList.toggle("light");
  todoList.classList.toggle("dark");
  if (body.classList.contains("light"))
    whole.style.backgroundImage = `url("./../images/bg-desktop-light.jpg")`;
  else whole.style.backgroundImage = `url("./../images/bg-desktop-dark.jpg")`;
};

toggleBtn.addEventListener("click", toggleFunction);

let todos = [];
const activeTodos = [];
let completedTodos = [];

formDOM.addEventListener("submit", function (e) {
  e.preventDefault();
  if (formInput.value === 0) return;
  const todoItem = {
    value: formInput.value,
    type: "off",
  };
  todos.push(todoItem);
  createTodo(todos);
  formInput.value = "";
  formInput.blur();
});

// todo markUp
const todoMarkUp = (todoItem) => {
  return `<li class="todo__items">
  <input
  type="checkbox"
  name="${todoItem.id}"
  class="checkbox"
  id="${todoItem.id}"
  ${todoItem.type === "on" ? "checked" : ""}

  data-id ="${todoItem.id}"
/>

<label class="todo__name" for="${todoItem}">${todoItem.value}</label>

  <span class="todo__icon">
    <img src="./images/icon-cross.svg"  data-id ="${todoItem.id}"
    class="todo__icon--cancel" alt="" />
  </span>
</li>`;
};

// Create todo function
const createTodo = function (todo) {
  todoList.innerHTML = "";
  if (todo.length === 0) return;
  todo
    .map((todoItem, i) => {
      todoItem.id = i + 1;
      const html = todoMarkUp(todoItem);
      todoList.insertAdjacentHTML("afterbegin", html);
    })
    .join("");
  updateTotal(todo);
};

/// Total function
const updateTotal = (todos) => {
  list.innerHTML = "";
  list.insertAdjacentHTML(
    "beforeend",
    `<span class="list__length total">${todos.length} items left</span>
  <div class="list__category">
    <span class="list__length active listL all">All</span
    ><span class="list__length activeList listL">Active</span
    ><span class="list__length complete listL">Completed</span>
  </div>
  <span class="list__length clear">Clear Completed</span>`
  );
};

// Creating a completed todo
todoList.addEventListener("click", function (e) {
  const click = e.target.closest(".checkbox");
  if (!click) return;
  click.addEventListener("change", function (e) {
    if (this.checked) {
      const [completed] = todos.filter((todo) => todo.id === +click.dataset.id);
      const completedExist = completedTodos.some(
        (todo) => todo.id === +click.dataset.id
      );
      if (completedExist) return;
      completed.type = "on";
      completedTodos.push(completed);
    } else {
      const completedExist = completedTodos.some(
        (todo) => todo.id === +click.dataset.id
      );
      if (completedExist) {
        const completed = completedTodos.findIndex(
          (todo) => todo.id === +click.dataset.id
        );
        const [completed2] = completedTodos.filter(
          (todo) => todo.id === +click.dataset.id
        );

        completed2.type = "off";

        completedTodos.splice(completed, 1);
      } else return;
    }
  });
});

// create completed todo
const createCompletedTodo = (completedTodos) => {
  todoList.innerHTML = "";

  if (completedTodos.length === 0) return;
  completedTodos.map((completedTodo) => {
    const html = `<li class="todo__items">
    <input
    type="checkbox"
    name="${completedTodo.id}"
    class="checkbox"
    id="${completedTodo.id}"

    data-id ="${completedTodo.id}"
    ${completedTodo.type === "on" ? "checked" : ""}

  />
  
  <label class="todo__name" for="${completedTodo}">${
      completedTodo.value
    }</label>
  
    <span class="todo__icon">
      <img src="./images/icon-cross.svg" data-id ="${completedTodo.id}"
      class="todo__icon--cancel" alt="" />
    </span>
  </li>`;
    todoList.insertAdjacentHTML("afterbegin", html);
  });
};
list.addEventListener("click", function (e) {
  const click = e.target.closest(".listL");
  if (!click) return;
  list
    .querySelectorAll(".listL")
    .forEach((list) => list.classList.remove("active"));
  click.classList.add("active");
  if (click.classList.contains("complete")) {
    createCompletedTodo(completedTodos);
  }
  if (click.classList.contains("all")) {
    createTodo(todos);
  }
  if (click.classList.contains("activeList")) {
    const active = todos.filter((todo) => todo.type !== "on");
    todoList.innerHTML = "";

    if (active.length > 0) activeTodos.push(active);
    else return;
    const realActive = activeTodos.pop();
    if (realActive.length === 0) return;
    realActive.forEach((realActive) => {
      const html = `<li class="todo__items">
    <input
    type="checkbox"
    name="${realActive.id}"
    class="checkbox"
    id="${realActive.id}"

    data-id ="${realActive.id}"
    ${realActive.type === "on" ? "checked" : ""}

  />

  <label class="todo__name" for="${realActive}">${realActive.value}</label>

   <!-- <span class="todo__icon">
      <img src="./images/icon-cross.svg" class="todo__icon--cancel" alt=""  data-id ="${
        realActive.id
      }"
      />
    </span> -->
  </li>`;

      todoList.insertAdjacentHTML("afterbegin", html);
    });
  }
});
todoList.addEventListener("click", function (e) {
  const click = e.target.closest(".todo__icon--cancel");
  if (!click) return;
  const id = click.dataset.id;
  const [findTodo] = todos.filter((todo) => todo.id === +id);
  const findTodoIndex = todos.findIndex((todo) => todo.id === findTodo.id);
  todos.splice(findTodoIndex, 1);

  const checkComplete = completedTodos.some((todo) => todo.id === findTodo.id);
  if (checkComplete) {
    const findCompleteIndex = completedTodos.findIndex(
      (todo) => todo.id === findTodo.id
    );
    completedTodos.splice(findCompleteIndex, 1);
  }
  const completeClass = document.querySelector(".complete");
  if (completeClass.classList.contains("active")) {
    createCompletedTodo(completedTodos);
  } else {
    createTodo(todos);
  }
  document.querySelector(".total").textContent = `${todos.length} items left`;
});

list.addEventListener("click", function (e) {
  const click = e.target.closest(".clear");
  if (!click) return;
  completedTodos = [];
  todos = todos.filter((todo) => todo.type !== "on");

  const completeClass = document.querySelector(".complete");

  if (completeClass.classList.contains("active")) {
    createCompletedTodo(completedTodos);
  } else {
    createTodo(todos);
  }
  document.querySelector(".total").textContent = `${todos.length} items left`;
});

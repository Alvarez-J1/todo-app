import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";
const addTodoButton = document.querySelector(".button_action_add");
const todoDateInput = document.querySelector("#todo-date");

const todoCounter = new TodoCounter(initialTodos, ".counter__text");
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
todoDateInput.min = today.toISOString().split("T")[0];

const generateTodo = (data) => {
  const todo = new Todo(data, "#todo-template", handleCheck, handleDelete);
  const todoElement = todo.getView();
  return todoElement;
};

function handleCheck(completed) {
  todoCounter.updateCompleted(completed);
}

function handleDelete(completed) {
  if (completed) {
    todoCounter.updateCompleted(false);
  }
  todoCounter.updateTotal(false);
}

const section = new Section({
  items: initialTodos,
  renderer: (item) => {
    const todo = generateTodo(item);
    section.addItem(todo);
  },
  containerSelector: ".todos__list",
});
section.renderItems();

const addTodoPopup = new PopupWithForm({
  popupSelector: "#add-todo-popup",
  handleFormSubmit: (values) => {
    const date = values.date ? new Date(values.date) : null;
    if (date) {
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    }

    const newTodo = {
      name: values.name.trim(),
      date: date,
      id: uuidv4(),
      completed: false,
    };
    section.renderer(newTodo);
    todoCounter.updateTotal(true);
  },
});

const addTodoForm = addTodoPopup.getForm();

addTodoPopup.setEventListeners();

const newTodoValidator = new FormValidator(validationConfig, addTodoForm);

newTodoValidator.enableValidation();

addTodoButton.addEventListener("click", () => {
  newTodoValidator.resetValidation();
  addTodoButton.setAttribute("aria-expanded", "true");
  addTodoPopup.open();
});

import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";

const addButtonSelector = ".button_action_add";
const addPopupSelector = "#add-todo-popup";
const counterSelector = ".counter__text";
const todosListSelector = ".todos__list";
const todoTemplateSelector = "#todo-template";
const todoDateSelector = "#todo-date";

const addTodoButton = document.querySelector(addButtonSelector);
const addTodoPopupElement = document.querySelector(addPopupSelector);
const todoDateInput = document.querySelector(todoDateSelector);

const todoCounter = new TodoCounter(initialTodos, counterSelector);
const todayDate = new Date();
todayDate.setMinutes(todayDate.getMinutes() - todayDate.getTimezoneOffset());
todoDateInput.min = todayDate.toISOString().split("T")[0];

const generateTodo = (data) => {
  const todo = new Todo(data, todoTemplateSelector, handleCheck, handleDelete);
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
  containerSelector: todosListSelector,
});
section.renderItems();

const addTodoPopup = new PopupWithForm({
  popupSelector: addPopupSelector,
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
  addTodoForm.elements.name.focus();
});

addTodoPopupElement.addEventListener("popup:close", () => {
  addTodoButton.setAttribute("aria-expanded", "false");
  addTodoButton.focus();
});

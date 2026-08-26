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
const popupCloseEvent = "popup:close";

const addTodoButton = document.querySelector(addButtonSelector);
const addTodoPopupElement = document.querySelector(addPopupSelector);
const todoDateInput = document.querySelector(todoDateSelector);

const todoCounter = new TodoCounter(initialTodos, counterSelector);

function getLocalDateString(date) {
  const localDate = new Date(date);
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  return localDate.toISOString().split("T")[0];
}

function parseTodoDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  const dueDate = new Date(dateValue);
  if (Number.isNaN(dueDate.getTime())) {
    return null;
  }

  dueDate.setMinutes(dueDate.getMinutes() + dueDate.getTimezoneOffset());
  return dueDate;
}

const todayDate = new Date();
todoDateInput.min = getLocalDateString(todayDate);

const generateTodo = (data) => {
  const todo = new Todo(data, todoTemplateSelector, handleCheck, handleDelete);
  return todo.getView();
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
    const date = parseTodoDate(values.date);
    const name = values.name.trim();

    const newTodo = {
      name,
      date,
      id: uuidv4(),
      completed: false,
    };
    section.renderItem(newTodo);
    todoCounter.updateTotal(true);
  },
});

const addTodoForm = addTodoPopup.getForm();

addTodoPopup.setEventListeners();

const newTodoValidator = new FormValidator(validationConfig, addTodoForm);

newTodoValidator.enableValidation();

function openAddTodoPopup() {
  newTodoValidator.resetValidation();
  addTodoButton.setAttribute("aria-expanded", "true");
  addTodoPopup.open();
  addTodoForm.elements.name.focus();
}

addTodoButton.addEventListener("click", openAddTodoPopup);

function handleAddTodoPopupClose() {
  addTodoButton.setAttribute("aria-expanded", "false");
  addTodoButton.focus();
}

addTodoPopupElement.addEventListener(popupCloseEvent, handleAddTodoPopupClose);

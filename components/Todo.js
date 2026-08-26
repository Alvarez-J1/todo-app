const DATE_FORMAT_OPTIONS = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

const TODO_CHECKBOX_SELECTOR = ".todo__completed";
const TODO_LABEL_SELECTOR = ".todo__label";
const TODO_DATE_SELECTOR = ".todo__date";
const TODO_DELETE_BUTTON_SELECTOR = ".todo__delete-btn";
const TODO_NAME_SELECTOR = ".todo__name";
const TODO_TEMPLATE_ITEM_SELECTOR = ".todo";
const TODO_COMPLETED_CLASS = "todo_completed";
const TODO_ID_PREFIX = "todo";

class Todo {
  constructor(data, selector, handleCheck, handleDelete) {
    this._completed = Boolean(data.completed);
    this._data = data;
    this._templateElement = document.querySelector(selector);
    this._handleCheck = handleCheck;
    this._handleDelete = handleDelete;

    if (!this._templateElement) {
      throw new Error(`Todo template not found: ${selector}`);
    }
  }

  _getCheckboxId() {
    return `${TODO_ID_PREFIX}-${this._data.id}`;
  }

  _getTodoName() {
    return this._data.name;
  }

  _generateCheckboxEl() {
    this._todoCheckboxEl = this._todoElement.querySelector(
      TODO_CHECKBOX_SELECTOR
    );
    const todoLabel = this._todoElement.querySelector(TODO_LABEL_SELECTOR);
    const checkboxId = this._getCheckboxId();

    this._todoCheckboxEl.checked = this._completed;
    this._todoElement.classList.toggle(TODO_COMPLETED_CLASS, this._completed);

    this._todoCheckboxEl.id = checkboxId;
    this._todoCheckboxEl.name = checkboxId;
    this._todoCheckboxEl.setAttribute("aria-label", this._getTodoName());
    todoLabel.setAttribute("for", checkboxId);
  }

  _generateDates() {
    this._todoDate = this._todoElement.querySelector(TODO_DATE_SELECTOR);
    if (!this._data.date) {
      this._todoDate.textContent = "";
      this._todoDate.removeAttribute("title");
      return;
    }

    const dueDate = new Date(this._data.date);
    if (!Number.isNaN(dueDate.getTime())) {
      const dueDateText = `Due: ${this._formatDate(dueDate)}`;
      this._todoDate.dateTime = this._getDateTimeValue(dueDate);
      this._todoDate.textContent = dueDateText;
      this._todoDate.title = dueDateText;
    } else {
      this._todoDate.removeAttribute("datetime");
      this._todoDate.removeAttribute("title");
    }
  }

  _formatDate(date) {
    return date.toLocaleString("en-US", DATE_FORMAT_OPTIONS);
  }

  _getDateTimeValue(date) {
    return date.toISOString().split("T")[0];
  }

  _generateDeleteBtn() {
    this._todoDeleteBtn = this._todoElement.querySelector(
      TODO_DELETE_BUTTON_SELECTOR
    );
    const deleteLabel = `Delete ${this._getTodoName()}`;
    this._todoDeleteBtn.setAttribute("aria-label", deleteLabel);
    this._todoDeleteBtn.title = deleteLabel;
  }

  _setEventListeners() {
    this._todoCheckboxEl.addEventListener("change", (evt) => {
      this._setCompletion(evt.target.checked);
      this._handleCheck(this._completed);
    });

    this._todoDeleteBtn.addEventListener("click", () => {
      this._handleDelete(this._completed);
      this._remove();
    });
  }

  _setCompletion = (completed) => {
    this._completed = completed;
    this._todoElement.classList.toggle(TODO_COMPLETED_CLASS, this._completed);
  };

  _remove = () => {
    this._todoElement.remove();
  };

  getView() {
    this._todoElement = this._templateElement.content
      .querySelector(TODO_TEMPLATE_ITEM_SELECTOR)
      .cloneNode(true);

    const todoNameEl = this._todoElement.querySelector(TODO_NAME_SELECTOR);

    todoNameEl.textContent = this._getTodoName();
    this._generateCheckboxEl();
    this._generateDeleteBtn();
    this._setEventListeners();
    this._generateDates();

    return this._todoElement;
  }
}

export default Todo;

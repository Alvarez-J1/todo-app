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
const ARIA_LABEL_ATTRIBUTE = "aria-label";
const DATETIME_ATTRIBUTE = "datetime";
const FOR_ATTRIBUTE = "for";
const NAME_ATTRIBUTE = "name";
const TITLE_ATTRIBUTE = "title";

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

  _getDeleteLabel() {
    return `Delete ${this._getTodoName()}`;
  }

  _generateCheckboxEl() {
    this._todoCheckboxEl = this._todoElement.querySelector(
      TODO_CHECKBOX_SELECTOR
    );
    const todoLabel = this._todoElement.querySelector(TODO_LABEL_SELECTOR);
    const checkboxId = this._getCheckboxId();

    if (!this._todoCheckboxEl) {
      throw new Error(`Todo checkbox not found: ${TODO_CHECKBOX_SELECTOR}`);
    }

    if (!todoLabel) {
      throw new Error(`Todo label not found: ${TODO_LABEL_SELECTOR}`);
    }

    this._todoCheckboxEl.checked = this._completed;
    this._todoElement.classList.toggle(TODO_COMPLETED_CLASS, this._completed);

    this._todoCheckboxEl.id = checkboxId;
    this._todoCheckboxEl.setAttribute(NAME_ATTRIBUTE, checkboxId);
    this._todoCheckboxEl.setAttribute(
      ARIA_LABEL_ATTRIBUTE,
      this._getTodoName()
    );
    todoLabel.setAttribute(FOR_ATTRIBUTE, checkboxId);
  }

  _generateDates() {
    this._todoDate = this._todoElement.querySelector(TODO_DATE_SELECTOR);

    if (!this._todoDate) {
      throw new Error(`Todo date element not found: ${TODO_DATE_SELECTOR}`);
    }

    if (!this._data.date) {
      this._clearDueDate();
      return;
    }

    const dueDate = new Date(this._data.date);
    if (!Number.isNaN(dueDate.getTime())) {
      const dueDateText = `Due: ${this._formatDate(dueDate)}`;
      this._todoDate.setAttribute(
        DATETIME_ATTRIBUTE,
        this._getDateTimeValue(dueDate)
      );
      this._todoDate.textContent = dueDateText;
      this._todoDate.setAttribute(TITLE_ATTRIBUTE, dueDateText);
    } else {
      this._clearDueDate();
    }
  }

  _clearDueDate() {
    this._todoDate.textContent = "";
    this._todoDate.removeAttribute(DATETIME_ATTRIBUTE);
    this._todoDate.removeAttribute(TITLE_ATTRIBUTE);
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

    if (!this._todoDeleteBtn) {
      throw new Error(
        `Todo delete button not found: ${TODO_DELETE_BUTTON_SELECTOR}`
      );
    }

    const deleteLabel = this._getDeleteLabel();
    this._todoDeleteBtn.setAttribute(ARIA_LABEL_ATTRIBUTE, deleteLabel);
    this._todoDeleteBtn.setAttribute(TITLE_ATTRIBUTE, deleteLabel);
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
    const todoTemplateItem = this._templateElement.content.querySelector(
      TODO_TEMPLATE_ITEM_SELECTOR
    );

    if (!todoTemplateItem) {
      throw new Error(
        `Todo template item not found: ${TODO_TEMPLATE_ITEM_SELECTOR}`
      );
    }

    this._todoElement = todoTemplateItem.cloneNode(true);

    const todoNameEl = this._todoElement.querySelector(TODO_NAME_SELECTOR);

    if (!todoNameEl) {
      throw new Error(`Todo name element not found: ${TODO_NAME_SELECTOR}`);
    }

    todoNameEl.textContent = this._getTodoName();
    this._generateCheckboxEl();
    this._generateDeleteBtn();
    this._setEventListeners();
    this._generateDates();

    return this._todoElement;
  }
}

export default Todo;

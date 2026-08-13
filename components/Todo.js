const DATE_FORMAT_OPTIONS = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

class Todo {
  constructor(data, selector, handleCheck, handleDelete) {
    this._completed = Boolean(data.completed);
    this._data = data;
    this._templateElement = document.querySelector(selector);
    this._handleCheck = handleCheck;
    this._handleDelete = handleDelete;
  }

  _generateCheckboxEl() {
    this._todoCheckboxEl = this._todoElement.querySelector(".todo__completed");
    const todoLabel = this._todoElement.querySelector(".todo__label");
    this._todoCheckboxEl.checked = this._completed;
    this._todoElement.classList.toggle("todo_completed", this._completed);

    this._todoCheckboxEl.id = `todo-${this._data.id}`;
    this._todoCheckboxEl.name = `todo-${this._data.id}`;
    this._todoCheckboxEl.setAttribute("aria-label", this._data.name);
    todoLabel.setAttribute("for", `todo-${this._data.id}`);
  }

  _generateDates() {
    this._todoDate = this._todoElement.querySelector(".todo__date");
    if (!this._data.date) {
      this._todoDate.textContent = "";
      return;
    }

    const dueDate = new Date(this._data.date);
    if (!Number.isNaN(dueDate.getTime())) {
      this._todoDate.dateTime = dueDate.toISOString().split("T")[0];
      this._todoDate.textContent = `Due: ${this._formatDate(dueDate)}`;
    } else {
      this._todoDate.removeAttribute("datetime");
    }
  }

  _formatDate(date) {
    return date.toLocaleString("en-US", DATE_FORMAT_OPTIONS);
  }

  _generateDeleteBtn() {
    this._todoDeleteBtn = this._todoElement.querySelector(".todo__delete-btn");
    const deleteLabel = `Delete ${this._data.name}`;
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
    this._todoElement.classList.toggle("todo_completed", this._completed);
  };

  _remove = () => {
    this._todoElement.remove();
  };

  getView() {
    this._todoElement = this._templateElement.content
      .querySelector(".todo")
      .cloneNode(true);

    const todoNameEl = this._todoElement.querySelector(".todo__name");

    todoNameEl.textContent = this._data.name;
    this._generateCheckboxEl();
    this._generateDeleteBtn();
    this._setEventListeners();
    this._generateDates();

    return this._todoElement;
  }
}

export default Todo;

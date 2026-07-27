class Todo {
  constructor(data, selector, handleCheck, handleDelete) {
    this._completed = data.completed;
    this._data = data;
    this._templateElement = document.querySelector(selector);
    this._handleCheck = handleCheck;
    this._handleDelete = handleDelete;
  }

  _generateCheckboxEl() {
    this._todoCheckboxEl = this._todoElement.querySelector(".todo__completed");
    const todoLabel = this._todoElement.querySelector(".todo__label");
    this._todoCheckboxEl.checked = this._data.completed;

    this._todoCheckboxEl.id = `todo-${this._data.id}`;
    todoLabel.setAttribute("for", `todo-${this._data.id}`);
  }

  _generateDates() {
    this._todoDate = this._todoElement.querySelector(".todo__date");

    const dueDate = new Date(this._data.date);
    if (!isNaN(dueDate)) {
      this._todoDate.textContent = `Due: ${dueDate.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}`;
    }
  }

  _generateDeleteBtn() {
    this._todoDeleteBtn = this._todoElement.querySelector(".todo__delete-btn");
    const deleteLabel = `Delete ${this._data.name}`;
    this._todoDeleteBtn.setAttribute("aria-label", deleteLabel);
    this._todoDeleteBtn.title = deleteLabel;
  }

  _setEventListeners() {
    this._todoCheckboxEl.addEventListener("change", () => {
      this._toggleCompletion();
      this._handleCheck(this._completed);
    });

    this._todoDeleteBtn.addEventListener("click", () => {
      this._handleDelete(this._completed);
      this._remove();
    });
  }

  _toggleCompletion = () => {
    this._completed = !this._completed;
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

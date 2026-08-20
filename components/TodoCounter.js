export default class TodoCounter {
  constructor(todos, selector) {
    this._element = document.querySelector(selector);
    this._completed = todos.filter((todo) => Boolean(todo.completed)).length;
    this._total = todos.length;
    this._updateText();
  }

  updateCompleted = (isCompleted) => {
    if (isCompleted) {
      this._completed = Math.min(this._completed + 1, this._total);
    } else {
      this._completed = Math.max(this._completed - 1, 0);
    }
    this._updateText();
  };

  updateTotal = (isAdded) => {
    if (isAdded) {
      this._total++;
    } else {
      this._total = Math.max(this._total - 1, 0);
    }
    this._completed = Math.min(this._completed, this._total);
    this._updateText();
  };

  _getText() {
    return `Showing ${this._completed} out of ${this._total} completed`;
  }

  _updateText() {
    this._element.textContent = this._getText();
  }
}

const MIN_TODO_COUNT = 0;

export default class TodoCounter {
  constructor(todos, selector) {
    this._element = document.querySelector(selector);

    if (!this._element) {
      throw new Error(`Todo counter element not found: ${selector}`);
    }

    this._completed = this._getCompletedCount(todos);
    this._total = this._getTotalCount(todos);
    this._updateText();
  }

  _getTotalCount(todos) {
    return todos.length;
  }

  _getCompletedCount(todos) {
    return todos.filter((todo) => this._isTodoCompleted(todo)).length;
  }

  _isTodoCompleted(todo) {
    return Boolean(todo.completed);
  }

  _getBoundedCompletedCount(count) {
    return Math.min(Math.max(count, MIN_TODO_COUNT), this._total);
  }

  _getCompletedDelta(isCompleted) {
    return isCompleted ? 1 : -1;
  }

  _getTotalDelta(isAdded) {
    return isAdded ? 1 : -1;
  }

  _getBoundedTotalCount(count) {
    return Math.max(count, MIN_TODO_COUNT);
  }

  _syncCompletedToTotal() {
    this._completed = this._getBoundedCompletedCount(this._completed);
  }

  updateCompleted = (isCompleted) => {
    this._completed = this._getBoundedCompletedCount(
      this._completed + this._getCompletedDelta(isCompleted)
    );
    this._updateText();
  };

  updateTotal = (isAdded) => {
    this._total = this._getBoundedTotalCount(
      this._total + this._getTotalDelta(isAdded)
    );
    this._syncCompletedToTotal();
    this._updateText();
  };

  _getCounterText() {
    return `Showing ${this._completed} out of ${this._total} completed`;
  }

  _setCounterText(text) {
    this._element.textContent = text;
  }

  _updateText() {
    this._setCounterText(this._getCounterText());
  }
}

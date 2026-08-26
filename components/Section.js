export default class Section {
  constructor({ items, renderer, containerSelector }) {
    this._items = [...items];
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);

    if (!this._container) {
      throw new Error(`Section container not found: ${containerSelector}`);
    }
  }
  renderItems() {
    this._items.forEach((item) => this.renderItem(item));
  }

  renderItem(item) {
    this._renderer(item);
  }

  addItem(element) {
    this._container.append(element);
  }
}

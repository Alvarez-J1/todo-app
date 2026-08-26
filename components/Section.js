export default class Section {
  constructor({ items, renderer, containerSelector }) {
    this._items = items;
    this.renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }
  renderItems() {
    this._items.forEach((item) => this.renderItem(item));
  }

  renderItem(item) {
    this.renderer(item);
  }

  addItem(element) {
    this._container.append(element);
  }
}

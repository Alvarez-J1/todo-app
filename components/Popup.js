const POPUP_CLOSE_SELECTOR = ".popup__close";
const POPUP_CLOSE_EVENT = "popup:close";
const POPUP_VISIBLE_CLASS = "popup_visible";
const ARIA_HIDDEN_ATTRIBUTE = "aria-hidden";

export default class Popup {
  constructor({ popupSelector }) {
    this._popupElement = document.querySelector(popupSelector);
    this._handleEscapeClose = this._handleEscapeClose.bind(this);
    this._isOpen = false;
  }

  _handleEscapeClose(evt) {
    if (evt.key === "Escape") {
      this.close();
    }
  }

  _dispatchCloseEvent() {
    this._popupElement.dispatchEvent(
      new CustomEvent(POPUP_CLOSE_EVENT, { bubbles: true })
    );
  }

  open() {
    if (this._isOpen) {
      return;
    }

    this._popupElement.classList.add(POPUP_VISIBLE_CLASS);
    this._popupElement.setAttribute(ARIA_HIDDEN_ATTRIBUTE, "false");
    document.addEventListener("keydown", this._handleEscapeClose);
    this._isOpen = true;
  }

  close() {
    if (!this._isOpen) {
      return;
    }

    this._popupElement.classList.remove(POPUP_VISIBLE_CLASS);
    this._popupElement.setAttribute(ARIA_HIDDEN_ATTRIBUTE, "true");
    document.removeEventListener("keydown", this._handleEscapeClose);
    this._isOpen = false;
    this._dispatchCloseEvent();
  }

  setEventListeners() {
    this._popupElement.addEventListener("click", (evt) => {
      if (!(evt.target instanceof Element)) {
        return;
      }

      if (
        evt.target.closest(POPUP_CLOSE_SELECTOR) ||
        evt.target === this._popupElement
      ) {
        this.close();
      }
    });
  }
}

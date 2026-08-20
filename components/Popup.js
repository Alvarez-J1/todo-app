const POPUP_CLOSE_SELECTOR = ".popup__close";
const POPUP_CLOSE_EVENT = "popup:close";

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

  open() {
    if (this._isOpen) {
      return;
    }

    this._popupElement.classList.add("popup_visible");
    this._popupElement.setAttribute("aria-hidden", "false");
    document.addEventListener("keydown", this._handleEscapeClose);
    this._isOpen = true;
  }

  close() {
    if (!this._isOpen) {
      return;
    }

    this._popupElement.classList.remove("popup_visible");
    this._popupElement.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", this._handleEscapeClose);
    this._isOpen = false;
    this._popupElement.dispatchEvent(
      new CustomEvent(POPUP_CLOSE_EVENT, { bubbles: true })
    );
  }

  setEventListeners() {
    this._popupElement.addEventListener("click", (evt) => {
      if (
        evt.target.closest(POPUP_CLOSE_SELECTOR) ||
        evt.target === this._popupElement
      ) {
        this.close();
      }
    });
  }
}

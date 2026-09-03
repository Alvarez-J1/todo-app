const POPUP_CLOSE_SELECTOR = ".popup__close";
const POPUP_CLOSE_EVENT = "popup:close";
const POPUP_VISIBLE_CLASS = "popup_visible";
const ARIA_HIDDEN_ATTRIBUTE = "aria-hidden";
const ESCAPE_KEY = "Escape";
const KEYDOWN_EVENT = "keydown";

export default class Popup {
  constructor({ popupSelector }) {
    this._popupElement = document.querySelector(popupSelector);

    if (!this._popupElement) {
      throw new Error(`Popup element not found: ${popupSelector}`);
    }

    this._handleEscapeClose = this._handleEscapeClose.bind(this);
    this._isOpen = false;
  }

  _handleEscapeClose(evt) {
    if (evt.key === ESCAPE_KEY) {
      this.close();
    }
  }

  _dispatchCloseEvent() {
    this._popupElement.dispatchEvent(
      new CustomEvent(POPUP_CLOSE_EVENT, { bubbles: true })
    );
  }

  _setHiddenState(isHidden) {
    this._popupElement.setAttribute(ARIA_HIDDEN_ATTRIBUTE, String(isHidden));
  }

  _isCloseClick(evt) {
    if (!(evt.target instanceof Element)) {
      return false;
    }

    return (
      evt.target.closest(POPUP_CLOSE_SELECTOR) ||
      evt.target === this._popupElement
    );
  }

  open() {
    if (this._isOpen) {
      return;
    }

    this._popupElement.classList.add(POPUP_VISIBLE_CLASS);
    this._setHiddenState(false);
    document.addEventListener(KEYDOWN_EVENT, this._handleEscapeClose);
    this._isOpen = true;
  }

  close() {
    if (!this._isOpen) {
      return;
    }

    this._popupElement.classList.remove(POPUP_VISIBLE_CLASS);
    this._setHiddenState(true);
    document.removeEventListener(KEYDOWN_EVENT, this._handleEscapeClose);
    this._isOpen = false;
    this._dispatchCloseEvent();
  }

  setEventListeners() {
    this._popupElement.addEventListener("click", (evt) => {
      if (this._isCloseClick(evt)) {
        this.close();
      }
    });
  }
}

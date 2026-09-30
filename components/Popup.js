const POPUP_CLOSE_SELECTOR = ".popup__close";
const POPUP_CLOSE_EVENT = "popup:close";
const POPUP_VISIBLE_CLASS = "popup_visible";
const ARIA_HIDDEN_ATTRIBUTE = "aria-hidden";
const ARIA_FALSE_VALUE = "false";
const ARIA_TRUE_VALUE = "true";
const ESCAPE_KEY = "Escape";
const TAB_KEY = "Tab";
const KEYDOWN_EVENT = "keydown";
const CLICK_EVENT = "click";
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

export default class Popup {
  constructor({ popupSelector }) {
    this._popupElement = document.querySelector(popupSelector);

    if (!this._popupElement) {
      throw new Error(`Popup element not found: ${popupSelector}`);
    }

    this._handleDocumentKeydown = this._handleDocumentKeydown.bind(this);
    this._isOpen = false;
    this._previousFocusedElement = null;
  }

  _handleDocumentKeydown(evt) {
    if (evt.key === ESCAPE_KEY) {
      this.close();
      return;
    }

    if (evt.key === TAB_KEY) {
      this._trapFocus(evt);
    }
  }

  _getFocusableElements() {
    return Array.from(
      this._popupElement.querySelectorAll(FOCUSABLE_SELECTOR)
    ).filter((element) => element instanceof HTMLElement);
  }

  _trapFocus(evt) {
    const focusableElements = this._getFocusableElements();

    if (focusableElements.length === 0) {
      evt.preventDefault();
      return;
    }

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

    if (evt.shiftKey && document.activeElement === firstFocusableElement) {
      evt.preventDefault();
      lastFocusableElement.focus();
    }

    if (!evt.shiftKey && document.activeElement === lastFocusableElement) {
      evt.preventDefault();
      firstFocusableElement.focus();
    }
  }

  _dispatchCloseEvent() {
    this._popupElement.dispatchEvent(
      new CustomEvent(POPUP_CLOSE_EVENT, { bubbles: true })
    );
  }

  _setHiddenState(isHidden) {
    this._popupElement.setAttribute(
      ARIA_HIDDEN_ATTRIBUTE,
      isHidden ? ARIA_TRUE_VALUE : ARIA_FALSE_VALUE
    );
  }

  _isOverlayClick(target) {
    return target === this._popupElement;
  }

  _isCloseButtonClick(target) {
    return Boolean(target.closest(POPUP_CLOSE_SELECTOR));
  }

  _isCloseClick(evt) {
    if (!(evt.target instanceof Element)) {
      return false;
    }

    return (
      this._isCloseButtonClick(evt.target) ||
      this._isOverlayClick(evt.target)
    );
  }

  _addEscapeCloseListener() {
    document.addEventListener(KEYDOWN_EVENT, this._handleDocumentKeydown);
  }

  _removeEscapeCloseListener() {
    document.removeEventListener(KEYDOWN_EVENT, this._handleDocumentKeydown);
  }

  _showPopupElement() {
    this._popupElement.classList.add(POPUP_VISIBLE_CLASS);
    this._setHiddenState(false);
  }

  _hidePopupElement() {
    this._popupElement.classList.remove(POPUP_VISIBLE_CLASS);
    this._setHiddenState(true);
  }

  _isPopupOpen() {
    return this._isOpen;
  }

  _setOpenState(isOpen) {
    this._isOpen = isOpen;
  }

  _saveFocusedElement() {
    this._previousFocusedElement = document.activeElement;

    if (!(this._previousFocusedElement instanceof HTMLElement)) {
      this._previousFocusedElement = null;
    }
  }

  _restoreFocus() {
    this._previousFocusedElement?.focus();
    this._previousFocusedElement = null;
  }

  open() {
    if (this._isPopupOpen()) {
      return;
    }

    this._saveFocusedElement();
    this._showPopupElement();
    this._addEscapeCloseListener();
    this._setOpenState(true);
  }

  close() {
    if (!this._isPopupOpen()) {
      return;
    }

    this._hidePopupElement();
    this._removeEscapeCloseListener();
    this._setOpenState(false);
    this._dispatchCloseEvent();
    this._restoreFocus();
  }

  setEventListeners() {
    this._popupElement.addEventListener(CLICK_EVENT, (evt) => {
      if (this._isCloseClick(evt)) {
        this.close();
      }
    });
  }
}

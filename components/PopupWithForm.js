import Popup from "./Popup.js";

const POPUP_FORM_SELECTOR = ".popup__form";
const POPUP_INPUT_SELECTOR = ".popup__input";

export default class PopupWithForm extends Popup {
  constructor({ popupSelector, handleFormSubmit }) {
    super({ popupSelector });
    this._popupForm = this._popupElement.querySelector(POPUP_FORM_SELECTOR);

    if (!this._popupForm) {
      throw new Error(`Popup form not found: ${POPUP_FORM_SELECTOR}`);
    }

    this._handleFormSubmit = handleFormSubmit;
    this._inputList = Array.from(
      this._popupForm.querySelectorAll(POPUP_INPUT_SELECTOR)
    );
  }

  _getInputValues() {
    const values = {};
    this._inputList.forEach((input) => {
      if (!input.name) {
        return;
      }

      values[input.name] = input.value;
    });
    return values;
  }

  getForm() {
    return this._popupForm;
  }

  _handleSubmit(evt) {
    evt.preventDefault();
    const inputValues = this._getInputValues();
    this._handleFormSubmit(inputValues);
    this.close();
  }

  setEventListeners() {
    super.setEventListeners();
    this._popupForm.addEventListener("submit", (evt) =>
      this._handleSubmit(evt)
    );
  }
}

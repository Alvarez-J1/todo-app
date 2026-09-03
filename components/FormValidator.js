const ERROR_ID_SUFFIX = "-error";
const ARIA_INVALID_ATTRIBUTE = "aria-invalid";
const ARIA_DISABLED_ATTRIBUTE = "aria-disabled";
const EMPTY_ERROR_MESSAGE = "";
const INPUT_EVENT = "input";
const SUBMIT_EVENT = "submit";
const ARIA_TRUE_VALUE = "true";

class FormValidator {
  constructor(settings, formEl) {
    this._inputSelector = settings.inputSelector;
    this._submitButtonSelector = settings.submitButtonSelector;
    this._errorClass = settings.errorClass;
    this._inputErrorClass = settings.inputErrorClass;
    this._inactiveButtonClass = settings.inactiveButtonClass;
    this._formEl = formEl;

    if (!this._formEl) {
      throw new Error("Form validator requires a form element.");
    }
  }

  _getErrorElement(inputElement) {
    const errorElementId = `#${inputElement.id}${ERROR_ID_SUFFIX}`;
    return this._formEl.querySelector(errorElementId);
  }

  _setInputInvalid(inputElement, isInvalid) {
    if (isInvalid) {
      inputElement.setAttribute(ARIA_INVALID_ATTRIBUTE, ARIA_TRUE_VALUE);
      return;
    }

    inputElement.removeAttribute(ARIA_INVALID_ATTRIBUTE);
  }

  _setInputErrorVisible(inputElement, isVisible) {
    inputElement.classList.toggle(this._inputErrorClass, isVisible);
  }

  _setErrorText(errorElement, message) {
    errorElement.textContent = message;
  }

  _setErrorVisible(errorElement, isVisible) {
    errorElement.classList.toggle(this._errorClass, isVisible);
  }

  _showInputError(inputElement, errorMessage) {
    const errorElement = this._getErrorElement(inputElement);
    if (!errorElement) {
      return;
    }

    this._setInputErrorVisible(inputElement, true);
    this._setInputInvalid(inputElement, true);
    this._setErrorText(errorElement, errorMessage);
    this._setErrorVisible(errorElement, true);
  }

  _hideInputError(inputElement) {
    const errorElement = this._getErrorElement(inputElement);
    this._setInputErrorVisible(inputElement, false);
    this._setInputInvalid(inputElement, false);
    if (!errorElement) {
      return;
    }

    this._setErrorVisible(errorElement, false);
    this._setErrorText(errorElement, EMPTY_ERROR_MESSAGE);
  }

  _checkInputValidity(inputElement) {
    if (!inputElement.validity.valid) {
      this._showInputError(inputElement, inputElement.validationMessage);
    } else {
      this._hideInputError(inputElement);
    }
  }

  _hasInvalidInput() {
    return this._inputList.some((inputElement) => {
      return !inputElement.validity.valid;
    });
  }

  _setButtonDisabled(isDisabled) {
    this._buttonElement.classList.toggle(
      this._inactiveButtonClass,
      isDisabled
    );
    this._buttonElement.disabled = isDisabled;
    this._buttonElement.setAttribute(
      ARIA_DISABLED_ATTRIBUTE,
      String(isDisabled)
    );
  }

  _toggleButtonState() {
    this._setButtonDisabled(this._hasInvalidInput());
  }

  _handleInput(inputElement) {
    this._checkInputValidity(inputElement);
    this._toggleButtonState();
  }

  _handleSubmit(evt) {
    evt.preventDefault();
    this.resetValidation();
  }

  _getInputList() {
    return Array.from(this._formEl.querySelectorAll(this._inputSelector));
  }

  _getButtonElement() {
    return this._formEl.querySelector(this._submitButtonSelector);
  }

  _setEventListeners() {
    this._inputList = this._getInputList();

    this._buttonElement = this._getButtonElement();

    if (!this._buttonElement) {
      throw new Error(
        `Validator submit button not found: ${this._submitButtonSelector}`
      );
    }

    this._toggleButtonState();

    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener(INPUT_EVENT, () => {
        this._handleInput(inputElement);
      });
    });
  }

  resetValidation() {
    this._inputList.forEach((inputElement) =>
      this._hideInputError(inputElement)
    );
    this._formEl.reset();
    this._toggleButtonState();
  }

  enableValidation() {
    this._formEl.addEventListener(SUBMIT_EVENT, (evt) =>
      this._handleSubmit(evt)
    );
    this._setEventListeners();
  }
}

export default FormValidator;

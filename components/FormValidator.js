const ERROR_ID_SUFFIX = "-error";
const ARIA_INVALID_ATTRIBUTE = "aria-invalid";
const ARIA_DISABLED_ATTRIBUTE = "aria-disabled";

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

  _showInputError(inputElement, errorMessage) {
    const errorElement = this._getErrorElement(inputElement);
    if (!errorElement) {
      return;
    }

    inputElement.classList.add(this._inputErrorClass);
    inputElement.setAttribute(ARIA_INVALID_ATTRIBUTE, "true");
    errorElement.textContent = errorMessage;
    errorElement.classList.add(this._errorClass);
  }

  _hideInputError(inputElement) {
    const errorElement = this._getErrorElement(inputElement);
    inputElement.classList.remove(this._inputErrorClass);
    inputElement.removeAttribute(ARIA_INVALID_ATTRIBUTE);
    if (!errorElement) {
      return;
    }

    errorElement.classList.remove(this._errorClass);
    errorElement.textContent = "";
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
      inputElement.addEventListener("input", () => {
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
    this._formEl.addEventListener("submit", (evt) => this._handleSubmit(evt));
    this._setEventListeners();
  }
}

export default FormValidator;

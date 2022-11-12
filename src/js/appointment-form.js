import { Fancybox } from "@fancyapps/ui/src/Fancybox/Fancybox";

const GRAY_PLACEHOLDER_CLASS = 'select-input--gray-placeholder';
const DEFAULT_BORDER_CLASS = 'appointment-form__input--default-border';
const ERROR_BORDER_CLASS = 'appointment-form__input--error-border';

export const initAppointmentForm = () => {
    console.log('init appointment');

    for(let i = 0; i < document.forms.length; i++) {

        const formElement = document.forms[i];

        const validationMessage = new Validation({
            appendParent: formElement,
        });

        if(formElement.classList.contains("appointment-form")) {

            //Добавляем слушателей
            AddEventListenerSubmit(formElement, validationMessage);
            AddEventListenerInput(formElement);
        }
    }
};

const AddEventListenerInput = (formElement) => {

    const inputs = createInputArray(formElement);
    const selectors = createSelectorArray(formElement);

    inputs.forEach((input) => {
        input.addEventListener('keyup', (event) => {
            event.preventDefault();
            input.classList.remove(ERROR_BORDER_CLASS);

            if (!input.classList.contains(DEFAULT_BORDER_CLASS)) {
                input.classList.add(DEFAULT_BORDER_CLASS);
            }
        });
    });

    selectors.forEach((select) => {
        select.classList.add(GRAY_PLACEHOLDER_CLASS);

        select.addEventListener('change', (event) => {
            event.preventDefault();

            if (select.classList.contains(GRAY_PLACEHOLDER_CLASS)) {
                select.classList.remove(GRAY_PLACEHOLDER_CLASS);
            }
        });
    });
};

const AddEventListenerSubmit = (formElement, validationMessage) => {

    const { name, phone, masterSelect, serviceSelect, visitDate, loader, submitButton  } = getFormElements(formElement);

    const inputs = createInputArray(formElement);

    formElement.addEventListener('submit', (event) => {
        event.preventDefault();

        inputs.forEach((input) => {
            if (!input.value) {
                input.classList.remove(DEFAULT_BORDER_CLASS);

                if (!input.classList.contains(ERROR_BORDER_CLASS)) {
                    input.classList.add(ERROR_BORDER_CLASS);
                }
            }
        });

        if (!name.value || !phone.value) {
            validationMessage.show(
                'Для записи необходимо заполнить все обязательные поля'
            );

            return;
        }

        const order = {
            name: name.value,
            phone: phone.value,
            visitDate: visitDate ? visitDate.value : '2023-02-01',
            masterId: masterSelect ? masterSelect.options[masterSelect.selectedIndex].value : 1,
            serviceId: serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].value : 2
        };

        //Тут надо метод отправки данных на свервер

        loader.classList.add('loader--visible');
        submitButton.disabled = true;

        setTimeout(() => {

            console.log('imitation server connecting');

            loader.classList.remove('loader--visible');
            submitButton.disabled = false;

            const fancybox = Fancybox.getInstance();
            fancybox.close();
            clearForm(formElement);

            validationMessage.show('Заявка успешно отправлена!', false, true);

        }, 2000);

    });
}

const createInputArray = (formEl) => {
    const { name, phone } = getFormElements(formEl);

    let inputs = [];

    if (name) {
        inputs = [...inputs, name];
    }

    if (phone) {
        inputs = [...inputs, phone];
    }

    return inputs;
};

const createSelectorArray = (formEl) => {
    const { masterSelect, serviceSelect } = getFormElements(formEl);

    let selectors = [];

    if (masterSelect) {
        selectors = [...selectors, masterSelect];
    }

    if (serviceSelect) {
        selectors = [...selectors, serviceSelect];
    }

    return selectors;
};

const clearForm = (formElement) => {
    for (let i = 0; i < formElement.elements.length; i++) {
        const formEl = formElement.elements[i];

        if ( formEl.type === 'text' ||
                formEl.type === 'tel'||
                    formEl.type === 'date') {

            formEl.value = '';
            formEl.classList.add(DEFAULT_BORDER_CLASS);

        } else if (formEl.type === 'select-one') {
            formEl.selectedIndex = 0;
        }
    }
};

const getFormElements = (formEl) => {
    const submitButton = getSubmitButton(formEl);
    const loader = submitButton ? submitButton.querySelector('.loader') : null;

    return {
        name: formEl.elements.name,
        phone: formEl.elements.phone,
        masterSelect: formEl.elements.masterSelect,
        serviceSelect: formEl.elements.serviceSelect,
        visitDate: formEl.elements.visitDate,
        loader,
        submitButton
    };
};

const getSubmitButton = (formEl) => {
    for (let i = 0; i < formEl.elements.length; i++) {
        const formElement = formEl.elements[i];

        if (formElement.type === 'submit') {
            return formElement;
        }
    }

    return null;
};

class Validation {
    constructor({ cssPrefix, hideTimeout, appendParent }) {
        this.cssPrefix = cssPrefix || 'validation';
        this.hideTimeout = hideTimeout || 3000;
        this.appendParent = appendParent || document.body;
    }

    show(message, disableAutoHide = false, isSuccess = false) {
        this.elem = this._createAlert(message);

        if (isSuccess) {
            this.elem.classList.add(`${this.cssPrefix}--success`);
        } else {
            this.elem.classList.add(`${this.cssPrefix}--error`);
        }

        this.appendParent.appendChild(this.elem);

        if (!disableAutoHide) {
            setTimeout(() => this.elem.remove(), this.hideTimeout);
        }
    }

    _createAlert(message) {
        const elem = document.createElement('div');
        elem.classList.add(this.cssPrefix);
        elem.innerHTML = `<span class="${this.cssPrefix}__message">${message}</span>`;

        return elem;
    }
}
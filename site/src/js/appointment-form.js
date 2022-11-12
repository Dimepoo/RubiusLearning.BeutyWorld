import { Fancybox } from "@fancyapps/ui/src/Fancybox/Fancybox";
import "inputmask";

const GRAY_PLACEHOLDER_CLASS = 'select-input--gray-placeholder';
const DEFAULT_BORDER_CLASS = 'appointment-form__input--default-border';
const ERROR_BORDER_CLASS = 'appointment-form__input--error-border';

export const initAppointmentForm = () => {
    console.log('init appointment');

    for(let i = 0; i < document.forms.length; i++) {

        const formElement = document.forms[i];

        Inputmask({"mask": "+7 (999) 999-9999"}).mask('input[name=phone]');

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

    const { name, phone, masterSelect, serviceSelect, visitDate } = getFormElements(formElement);

    const inputs = createInputArray(formElement);

    formElement.addEventListener('submit', (event) => {
        event.preventDefault();

        inputs.forEach((input) => {
            if (!input.value && input.name != 'visitDate') {
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
            masterId: masterSelect ? masterSelect.options[masterSelect.selectedIndex].value : 1,
            serviceId: serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].value : 2,
            visitDate: visitDate ? visitDate.value : '2023-02-01'
        };

        fetchOrder(order, validationMessage, formElement);

    });
}

const createInputArray = (formElement) => {
    const { name, phone, visitDate } = getFormElements(formElement);

    let inputs = [];

    if (name) {
        inputs = [...inputs, name];
    }

    if (phone) {
        inputs = [...inputs, phone];
    }

    if (visitDate) {
        inputs = [...inputs, visitDate];
    }

    return inputs;
};

const createSelectorArray = (formElement) => {
    const { masterSelect, serviceSelect } = getFormElements(formElement);

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

const getFormElements = (formElement) => {
    const submitButton = getSubmitButton(formElement);
    const loader = submitButton ? submitButton.querySelector('.loader') : null;

    return {
        name: formElement.elements.name,
        phone: formElement.elements.phone,
        masterSelect: formElement.elements.masterSelect,
        serviceSelect: formElement.elements.serviceSelect,
        visitDate: formElement.elements.visitDate,
        loader,
        submitButton
    };
};

const getSubmitButton = (formElement) => {
    for (let i = 0; i < formElement.elements.length; i++) {
        const formEl = formElement.elements[i];

        if (formEl.type === 'submit') {
            return formEl;
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
        this.elem = this.#createAlert(message);

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

    #createAlert(message) {
        const elem = document.createElement('div');
        elem.classList.add(this.cssPrefix);
        elem.innerHTML = `<span class="${this.cssPrefix}__message">${message}</span>`;

        return elem;
    }
}

const fetchOrder = (order, validationMessage, formElement) => {
    const { loader, submitButton } = getFormElements(formElement);

    loader.classList.add('loader--visible');
    submitButton.classList.add('base-button--disable');
    submitButton.querySelector('span').style.display = 'none';
    submitButton.disabled = true;

    fetch('https://beauty-saloon-server.herokuapp.com/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    })
        .then((response) => {
            if (response.status === 201) {
                validationMessage.show('Ваша заявка отправлена! Ожидайте звонка менеджера', false, true);
                submitButton.querySelector('span').style.display = 'block';

                setTimeout(() => {
                    clearForm(formElement);
                    const fancybox = Fancybox.getInstance();
                    fancybox.close();
                    submitButton.disabled = false;
                    submitButton.classList.remove('base-button--disable');
                }, 3000);
            } else if (response.status === 400 || response.status === 404) {
                response.text().then((responseText) => {
                    validationMessage.show(responseText.message);
                });
            }
        })
        .catch((error) => {
            validationMessage.show(error.message);
        })
        .finally(() => {
            loader.classList.remove('loader--visible');
        });
};
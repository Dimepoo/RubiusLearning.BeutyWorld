
export const initAppointmentForm = () => {
    console.log('.appointment-form');

    const formEl = document.forms.appointmentForm;

    formEl.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameInput = formEl.elements.name;
        const phoneInput = formEl.elements.phone;

        if (!nameInput.value && !phoneInput.value)
        {
            alert('Для записи необходимо ввести ваше имя и номер телефона');
            return;
        }

        const user = {
            name: nameInput.value,
            phone: phoneInput.value
        }

        console.log(user);
    });
};
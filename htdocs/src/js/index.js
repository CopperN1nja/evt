//DOM-elements for registration pop-up
const popUp = document.querySelector(".pop-up__registration");
const popUpCross = document.querySelector(".pop-up__cross");
const submitBtn = document.querySelector(".pop-up__form-btn");
const registerBtn = document.querySelector(".header__info-item--register");

const nameInput = document.querySelector(".pop-up__input--name > input");
const emailInput = document.querySelector(".pop-up__input--email > input");
const passwordInput = document.querySelector(".pop-up__input--password > input");

let errors = {
    name: [],
    email: [],
    password: []
};

//refreshes popUp
function renewPopUp() {
    errors = { name: [], email: [], password: [] }
    for(let error of document.querySelectorAll('.pop-up__form-error')) error.remove();
    nameInput.value = ''
    emailInput.value = ''
    passwordInput.value = ''
}

//event handler for showing pop-up form
function showPopUpForm(event) {
    event.preventDefault();

    document.body.classList.add("lock");
    popUp.classList.remove("pop-up--hidden");
}

//event handler that hides pop-up form
function hidePopUpForm(event) {
    if(event.target.classList.contains('pop-up__body') ||
       event.target.closest('.pop-up__cross')) {
        popUp.classList.add("pop-up--hidden");
        setTimeout(() => {
            document.body.classList.remove("lock")
            renewPopUp()
        }, 250);
    }
}

//event handler for sumbiting form
function submitHandler(event) {
    event.preventDefault();

    const data = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value
    }

    errors = {
        name: [],
        email: [],
        password: []
    }

    errors = { ...validateForm({ ...data }) };

    if(canBeSubmited(errors)) {
        popUp.classList.add("pop-up--hidden");
        setTimeout(async () => {
            document.body.classList.remove("lock")
            renewPopUp()

            try {
                let response = await fetch('http://localhost:3000/register/', {
                    mode: 'no-cors',
                    method: 'POST',
                    headers: {
                        'Accept': 'application/jspn',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                console.log(response);
            } catch(e) {
                console.log(e);
            }
        }, 250);
    } else {
        for(let error of document.querySelectorAll('.pop-up__form-error')) error.remove();

        for(let label of document.querySelectorAll('.pop-up__input')) {
            labelName = label.getAttribute('name')
            labelErrors = errors[labelName]

            for(let labelError of labelErrors) {
                error_p = document.createElement('p')
                error_p.classList.add('pop-up__form-error')
                error_p.textContent = labelError
                label.appendChild(error_p)
            }
        }
    }
}

//form validation
function validateForm({ name, email, password }) {
    new_errors = { name: [], email: [], password: [] };

    if(name.length <= 3) {
        new_errors.name.push("Никнейм должно быть больше 3 символов");
    }

    if (!/^[а-яА-Я]*$/.test(name)) {
        new_errors.name.push("Только кириллица");
    }

    if(!/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(email)) {
        new_errors.email.push("Ошибка в email!");
    }

    if(password.length <= 3) {
        new_errors.password.push("Пароль должен быть больше 3 символов");
    }

    return new_errors;
}

//defines if form can be submited
function canBeSubmited(errorObj) {
    for(let error of Object.values(errorObj)){
        if(error.length != 0) return false;
    }
    return true
}

//event for register btn in header
registerBtn?.addEventListener("click", showPopUpForm);
//event listener for pop-up cross
popUpCross?.addEventListener("click", hidePopUpForm);
//event listener for pop-up
popUp?.addEventListener("click", hidePopUpForm);
//event for submit btn
submitBtn?.addEventListener("click", submitHandler);

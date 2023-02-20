const form = document.forms[0];
const email = form.email;
const country = form.country;
const zip = form.zip;
const pass = form.password;
const confirm = form["password-confirm"];

function getErrorElement(input) {
    return input.closest(".form-control").querySelector(".error");
}

const validate = {
    email() {
        const emailError = getErrorElement(email);
        if (email.validity.valid) {
            emailError.textContent = "";
        } else if (email.validity.valueMissing) {
            emailError.textContent = "Email address cannot be empty";
        } else if (email.validity.typeMismatch) {
            emailError.textContent =
                "This must be valid email address";
        }
    },
    zip() {
        const zipError = getErrorElement(zip);

        const constraints = {
            sk: [
                /^(sk-)?\d{3}\s\d{2}$/i,
                "Slovak ZIP codes must have 3 digits followed by space and 2 digits",
            ],
            cz: [
                /^(cz-)?\d{3}\s\d{2}$/i,
                "Czech ZIP codes must have 3 digits followed by space and 2 digits",
            ],
        };

        const isValidPattern = validatePattern();

        if (zip.validity.valid) {
            zipError.textContent = "";
        } else if (zip.validity.valueMissing) {
            zipError.textContent = "zip cannot be empty";
        } else if (!isValidPattern) {
            zipError.textContent = zip.validationMessage;
        }

        function validatePattern() {
            const countryCode = country.value;
            const isValidZipPattern = constraints[
                countryCode
            ][0].test(zip.value);

            if (!isValidZipPattern) {
                zip.setCustomValidity(constraints[countryCode][1]);
            } else {
                zip.setCustomValidity("");
            }

            return isValidZipPattern;
        }
    },
    pass() {
        const passError = getErrorElement(pass);

        console.log(pass.validity.patternMismatch);

        if (pass.validity.valid) {
            passError.textContent = "";
        } else if (pass.validity.valueMissing) {
            passError.textContent = "password cannot be empty";
        } else if (pass.validity.tooShort) {
            passError.textContent =
                "password must be at least 6 chars long";
        } else if (pass.validity.patternMismatch) {
            passError.textContent =
                "password must contain 1 uppercase letter and 1 special symbol";
        }
    },
    confirm() {
        const confirmError = getErrorElement(confirm);

        if (confirm.validity.valueMissing) {
            confirm.setCustomValidity(
                "Confirm password cannot be empty"
            );
        } else if (confirm.value !== pass.value) {
            confirm.setCustomValidity(
                "field does not match with password"
            );
        } else {
            confirm.setCustomValidity("");
        }
        confirmError.textContent = confirm.validationMessage;
    },
};

form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    email.classList.add("interacted");
    validate.email();
    zip.classList.add("interacted");
    validate.zip();
    pass.classList.add("interacted");
    validate.pass();
    confirm.classList.add("interacted");
    validate.confirm();
    // const isValidForm = form.checkValidity();
    if (isValidForm) {
        /* show high five */
    } else {
    }
});

email.addEventListener("focusout", (evt) => {
    email.classList.add("interacted");
    validate.email();
});
zip.addEventListener("focusout", (evt) => {
    zip.classList.add("interacted");
    validate.zip();
});
pass.addEventListener("focusout", (evt) => {
    pass.classList.add("interacted");
    validate.pass();
});
confirm.addEventListener("focusout", (evt) => {
    confirm.classList.add("interacted");
    validate.confirm();
});

email.addEventListener("input", validate.email);
country.addEventListener("change", validate.zip);
zip.addEventListener("input", validate.zip);
pass.addEventListener("input", (evt) => {
    validate.pass();
    validate.confirm();
});
confirm.addEventListener("input", validate.confirm);

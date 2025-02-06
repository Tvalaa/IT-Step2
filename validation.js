const form = document.getElementById('form')
const firstname_input = document.getElementById('firstname-input')
const lastname_input = document.getElementById('lastname-input')
const age_input = document.getElementById('age-input')
const address_input = document.getElementById('address-input')
const phone_input = document.getElementById('phone-input')
const zipcode_input = document.getElementById('zipcode-input')
const avatar_input = document.getElementById('avatar-input')
const gender_input = document.getElementById('gender-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const repeat_password_input = document.getElementById('repeat-password-input')
const error_message = document.getElementById('error-message')

form.addEventListener('submit', async (e) => {
    let errors = []

    if (repeat_password_input) {
        errors = getSignupFormErrors(
            firstname_input.value,
            lastname_input.value,
            age_input.value,
            address_input.value,
            phone_input.value,
            zipcode_input.value,
            avatar_input.value,
            gender_input.value,
            email_input.value,
            password_input.value,
            repeat_password_input.value
        )
    } else {
        errors = getLoginFormErrors(email_input.value, password_input.value)
    }

    if (errors.length > 0) {
        e.preventDefault()
        error_message.innerText = errors.join('. ')
    } else {
        e.preventDefault()
        if (repeat_password_input) {
            await handleSignUp()
        } else {
            await handleSignIn()
        }
    }
})

function getSignupFormErrors(firstname, lastname, age, address, phone, zipcode, avatar, gender, email, password, repeatPassword) {
    let errors = []

    if (firstname === '' || firstname == null) {
        errors.push('Firstname is required')
        firstname_input.parentElement.classList.add('incorrect')
    }
    if (lastname === '' || lastname == null) {
        errors.push('Lastname is required')
        lastname_input.parentElement.classList.add('incorrect')
    }
    if (age === '' || age == null || isNaN(age) || age < 13) {
        errors.push('Age must be above 13')
        age_input.parentElement.classList.add('incorrect')
    }
    if (address === '' || address == null) {
        errors.push('Address is required')
        address_input.parentElement.classList.add('incorrect')
    }
    if (phone === '' || phone == null || phone.length < 10 || phone.length > 15) {
        errors.push('Phone number must have a typical length')
        phone_input.parentElement.classList.add('incorrect')
    }
    if (zipcode === '' || zipcode == null) {
        errors.push('Zipcode is required')
        zipcode_input.parentElement.classList.add('incorrect')
    }
    if (avatar === '' || avatar == null || avatar.length < 3) {
        errors.push('Avatar must be more than 2 characters long')
        avatar_input.parentElement.classList.add('incorrect')
    }
    if (gender === '' || gender == null) {
        errors.push('Gender is required')
        gender_input.parentElement.classList.add('incorrect')
    }
    if (email === '' || email == null) {
        errors.push('Email is required')
        email_input.parentElement.classList.add('incorrect')
    }
    if (password === '' || password == null) {
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }
    if (password.length < 8) {
        errors.push('Password must have 8 characters')
        password_input.parentElement.classList.add('incorrect')
    }
    if (repeatPassword === '' || repeatPassword == null) {
        errors.push('Repeat password is required')
        repeat_password_input.parentElement.classList.add('incorrect')
    }
    if (password !== repeatPassword) {
        errors.push('Password does not match repeated password')
        password_input.parentElement.classList.add('incorrect')
        repeat_password_input.parentElement.classList.add('incorrect')
    }

    return errors;
}

function getLoginFormErrors(email, password) {
    let errors = []

    if (email === '' || email == null) {
        errors.push('Email is required')
        email_input.parentElement.classList.add('incorrect')
    }
    if (password === '' || password == null) {
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }

    return errors;
}

const allInputs = [
    firstname_input, lastname_input, age_input, address_input, phone_input, zipcode_input, avatar_input, gender_input, 
    email_input, password_input, repeat_password_input
].filter(input => input != null)

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('incorrect')) {
            input.parentElement.classList.remove('incorrect')
            error_message.innerText = ''
        }
    })
})

async function handleSignUp() {
    const userData = {
        firstName: firstname_input.value,
        lastName: lastname_input.value,
        age: parseInt(age_input.value, 10),
        email: email_input.value,
        password: password_input.value,
        address: address_input.value,
        phone: phone_input.value,
        zipcode: zipcode_input.value,
        avatar: avatar_input.value,
        gender: gender_input.value.toUpperCase(),
    }

    try {
        const response = await fetch('https://api.everrest.educata.dev/auth/sign_up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })

        if (!response.ok) {
            const data = await response.json()
            error_message.innerText = data.message || 'Something went wrong'
        } else {
            const data = await response.json()
            console.log('Signup successful', data)
            window.location.href = '/IT-Step2/login.html';
        }
    } catch (error) {
        error_message.innerText = 'Error: ' + error.message
    }
}

async function handleSignIn() {
    const userData = {
        email: email_input.value,
        password: password_input.value,
    }

    try {
        const response = await fetch('https://api.everrest.educata.dev/auth/sign_in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })

        if (!response.ok) {
            const data = await response.json()
            error_message.innerText = data.message || 'Something went wrong'
        } else {
            const data = await response.json()
            console.log('Signin successful', data)
            localStorage.setItem('auth_token', data.token)
            window.location.href = '/IT-Step2/shop.html'; 
        }
    } catch (error) {
        error_message.innerText = 'Error: ' + error.message
    }
}

const activeButton1 = (txt) => {
    const bt = document.getElementById('login');
    if (txt.value != '') {
        bt.disabled = false;
    } else {
        bt.disabled = true;
    }
}

const activeButton2 = (txt) => {
    const bt = document.getElementById('register');
    if (txt.value != '') {
        bt.disabled = false;
    } else {
        bt.disabled = true;
    }
}

const login = () => {
    let username = document.getElementById('username1').value;
    let password = document.getElementById('password1').value;
    const user = {
            username,
            password
        }
        // console.log(user);
    fetchData(user)
}

const register = () => {
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let mail = document.getElementById('email').value;
    let country = document.getElementById('country').value;
    let city = document.getElementById('city').value;
    let street = document.getElementById('street').value;
    let username = document.getElementById('username2').value;
    let password = document.getElementById('password2').value;
    const user = {
            firstName,
            lastName,
            mail,
            country,
            city,
            street,
            username,
            password
        }
        // console.log(user);
    fetchData(user)
}

const fetchData = (data) => {
    // console.log(Object.keys(data).length)
    if (Object.keys(data).length === 2) {
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => { console.log(err) })
    } else {
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        .then(res => res.json())
            .then(data => toLogin(data))
            .catch(err => { console.log(err); })
    }
}

const toLogin = (msg) => {
    const root = document.getElementById("welcome_msg");
    root.innerHTML = '';
    const text = document.createElement("h3");
    const res = JSON.stringify(msg.message);
    text.innerHTML = JSON.parse(res);
    root.appendChild(text);
}
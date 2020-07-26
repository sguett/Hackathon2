// fetch the server to have data cards and upload them
fetch('http://localhost:3000/all_projects')
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        if (data.length == 0) {
            console.log("O PROJECTS");
            noProject("Any project! Create a new project with the button!");
        } else {
            console.log('Getting the projects')
            data.forEach(el => {
                createCard(el)
            })
        }

    })
    // console.log(data))
    .catch(err => console.log(err))

// function if there is no project: just display text
const noProject = (textToDisplay) => {
    const anyProject = document.getElementById("anyProject");
    anyProject.innerHTML = "";
    const text = document.createElement("h2");
    text.innerHTML = textToDisplay;
    text.setAttribute("style", "text-align: center;color: #31AABB; font-weight: bold;");
    text.style.marginTop = "30px";
    anyProject.appendChild(text);
}

// function for create cards with data come from the server & database
const createCard = (data) => {
    const anyProject = document.getElementById("anyProject");
    anyProject.innerHTML = "";
    const root = document.getElementById("root")
    const div1 = document.createElement("div");
    div1.classList.add("col", "mb-4", data.localisation.toLowerCase());
    const div2 = document.createElement("div");
    div2.classList.add("card");
    const img = document.createElement("img");
    img.setAttribute("src", data.image);
    img.classList.add("card-img-top");

    const div3 = document.createElement("div");
    div3.classList.add("card-body");
    const h5 = document.createElement("h5");
    h5.classList.add("card-title");
    h5.innerHTML = data.name;
    h5.setAttribute("style", "font-weight: bold");
    const h6 = document.createElement("h6");
    h6.classList.add("card-subtitle");
    h6.innerHTML = "Localisation: " + data.localisation;
    h6.setAttribute("style", "margin-bottom:10px")
    const desc = document.createElement("p");
    desc.classList.add("card-text");
    desc.innerHTML = data.description;

    const button1 = document.createElement("button");
    button1.type = "button";
    button1.setAttribute("class", "btn btn-primary btn-sm")
    button1.classList.add("card-link");
    button1.setAttribute("onclick", `location.href='infoProject.html?name=${data.name}';`)
    button1.id = "moreInfo";
    button1.innerHTML = "More info";

    const button2 = document.createElement("button");
    button2.type = "button";
    button2.setAttribute("class", "btn btn-primary btn-sm")
    button2.classList.add("card-link");
    button2.setAttribute("onclick", `joinProject("${data.name}")`)
    button2.id = data.name;
    button2.innerHTML = "Join!";

    const button3 = document.createElement("button");
    button3.type = "button";
    button3.setAttribute("class", "btn btn-primary btn-sm")
    button3.classList.add("card-link");
    button3.id = "donate";
    button3.innerHTML = "Donate!";

    div3.appendChild(h5);
    div3.appendChild(h6);
    div3.appendChild(desc);
    div3.appendChild(button1);
    div3.appendChild(button2);
    div3.appendChild(button3);

    div2.appendChild(img);
    div2.appendChild(div3);

    div1.appendChild(div2);
    root.appendChild(div1);
};

// function for filter cards
const filter = () => {
    const localisation = document.getElementById('localisation').value;
    const cards = document.querySelectorAll('.col');
    let count = 0;
    if (cards.length == 0) {
        noProject("Any project! Create a new project with the button!");
    } else {
        debugger;
        const anyProject = document.getElementById("anyProject");
        anyProject.innerHTML = "";
        cards.forEach(el => {
            if (localisation.toLowerCase() == "all") {
                el.style.display = "";
            } else if (el.classList[2] === localisation.toLowerCase()) {
                el.style.display = "";
            } else {
                count++;
                el.style.display = "none";
            }
        })
    }
    if (count == cards.length) {
        noProject(`Any project in ${localisation}!`);
    }
};

// function for join project
const joinProject = (name) => {
    console.log("ok");
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    join = {
        user: "sam",
        name: name,
        date
    }
    fetch('http://localhost:3000/joinProject', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(join)
        })
        .then(res => res.json())
        .then(data => {
            // alert(data.message);
            const join = document.getElementById(name);
            join.disabled = true;
            join.innerHTML = "Joined";
        })
        .catch(err => console.log(err))
}
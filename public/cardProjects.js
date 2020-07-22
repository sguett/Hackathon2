fetch('http://localhost:3000/projects')
    .then(res => res.json())
    .then(data =>
        data.forEach(el => {
            // console.log(el)
            // img = "https://source.unsplash.com/1600x900/?volunteer";
            createCard(el)
        }))
    // console.log(data))
    .catch(err => console.log(err))

const createCard = (data) => {
    const root = document.getElementById("root")
    const div1 = document.createElement("div");
    div1.classList.add("col", "mb-4");
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
    const desc = document.createElement("p");
    desc.classList.add("card-text");
    desc.innerHTML = data.description;

    const button1 = document.createElement("button");
    button1.type = "button";
    button1.setAttribute("class", "btn btn-primary btn-sm")
    button1.classList.add("card-link");
    button1.id = "moreInfo";
    button1.innerHTML = "More info";

    const button2 = document.createElement("button");
    button2.type = "button";
    button2.setAttribute("class", "btn btn-primary btn-sm")
    button2.classList.add("card-link");
    button2.id = "join";
    button2.innerHTML = "Join!";

    const button3 = document.createElement("button");
    button3.type = "button";
    button3.setAttribute("class", "btn btn-primary btn-sm")
    button3.classList.add("card-link");
    button3.id = "donate";
    button3.innerHTML = "Donate!";

    div3.appendChild(h5);
    div3.appendChild(desc);
    div3.appendChild(button1);
    div3.appendChild(button2);
    div3.appendChild(button3);

    div2.appendChild(img);
    div2.appendChild(div3);

    div1.appendChild(div2);
    root.appendChild(div1);
};
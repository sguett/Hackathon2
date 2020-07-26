const name = document.location.search;
fetch(`http://localhost:3000/infoProject${name}`)
    .then(res => res.json())
    .then(data => {
        // console.log(data[0]);
        createInfo(data[0]);
    })
    .catch(err => console.log(err))

const createInfo = (data) => {
    const root = document.getElementById("root")
    const div1 = document.createElement("div");
    div1.classList.add("col", "mb-4", data.localisation.toLowerCase());
    const div2 = document.createElement("div");
    div2.classList.add("card", "card1");
    // const img = document.createElement("img");
    // img.setAttribute("src", data.image);
    // img.classList.add("card-img-top");

    const div3 = document.createElement("div");
    div3.classList.add("card-body");
    const divImg = document.createElement("div");
    divImg.classList.add("card-body", "card-img");
    const h4 = document.createElement("h4");
    h4.classList.add("card-title");
    h4.innerHTML = data.name;
    h4.setAttribute("style", "font-weight: bold");
    const h6 = document.createElement("h6");
    h6.classList.add("card-subtitle");
    h6.innerHTML = "Localisation: " + data.localisation;
    h6.setAttribute("style", "margin-bottom:10px")
    const desc = document.createElement("p");
    desc.classList.add("card-text");
    desc.innerHTML = data.description;

    const div4 = document.createElement("div");
    div4.classList.add("card-desc");
    const volunteers = document.createElement("h6");
    volunteers.innerHTML = "Needs " + data.needs_volunteers + " volunteers!";
    volunteers.setAttribute("style", "font-weight: bold");
    volunteers.style.marginBottom = "10px";

    const funds = document.createElement("h6");
    funds.innerHTML = "Needs " + data.funds + "$!";
    funds.setAttribute("style", "font-weight: bold");

    const button2 = document.createElement("button");
    button2.type = "button";
    button2.setAttribute("class", "btn btn-primary btn-sm");
    button2.classList.add("card-link");
    button2.id = "join";
    button2.innerHTML = "Join!";

    const button3 = document.createElement("button");
    button3.type = "button";
    button3.setAttribute("class", "btn btn-primary btn-sm")
    button3.classList.add("card-link");
    button3.id = "donate";
    button3.innerHTML = "Donate!";

    div4.appendChild(volunteers);
    div4.appendChild(button2);
    div4.appendChild(funds);
    div4.appendChild(button3);

    div3.appendChild(h4);
    div3.appendChild(h6);
    div3.appendChild(desc);
    div3.appendChild(div4);

    div2.appendChild(div3);
    div2.appendChild(divImg);

    div1.appendChild(div2);
    root.appendChild(div1);


    fetch("https://api.unsplash.com/search/photos?query=volunteers&client_id=RGiYuZ7Zg4StPMKGqwtASLom8qf4VkLZWSqNIflsH5c")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            displayImages(data.results)
        })
        .catch(err => console.log(err))
};

const displayImages = (data) => {
    const card = document.getElementsByClassName('card-img')[0];
    // debugger
    for (let i = 0; i < 6; i++) {
        // let rand = Math.floor(Math.random() * 20);
        let img = document.createElement("img");
        img.setAttribute("src", data[i].urls.thumb);
        // img.style.width = "50%";
        card.appendChild(img)
    }
    console.log(data);
}
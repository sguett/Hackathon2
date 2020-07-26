const name = document.location.search;
fetch(`http://localhost:3000/infoProject${name}`)
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        createInfo(data, data[2]);
    })
    .catch(err => console.log(err))​
const createInfo = (data, activeBtn) => {
    const root = document.getElementById("root")
    root.innerHTML = "";
    const div1 = document.createElement("div");
    if (data[0].localisation.split(" ").length > 1) {
        div1.classList.add("col", "mb-4", data[0].localisation.replace(" ", "_").toLowerCase());
    } else {
        div1.classList.add("col", "mb-4", data[0].localisation.toLowerCase());
    }
    const div2 = document.createElement("div");
    div2.classList.add("card", "card1");​
    const div3 = document.createElement("div");
    div3.classList.add("card-body");
    const divImg = document.createElement("div");
    divImg.classList.add("card-body", "card-img");
    const h4 = document.createElement("h4");
    h4.classList.add("card-title");
    h4.innerHTML = data[0].name;
    h4.setAttribute("style", "font-weight: bold");
    const h6 = document.createElement("h6");
    h6.classList.add("card-subtitle");
    h6.innerHTML = "Localisation: " + data[0].localisation;
    h6.setAttribute("style", "margin-bottom:10px")
    const desc = document.createElement("p");
    desc.classList.add("card-text");
    desc.innerHTML = data[0].description;​
    const div4 = document.createElement("div");
    div4.classList.add("card-desc");
    const volunteers = document.createElement("h6");
    volunteers.innerHTML = data[1].count + "/" + data[0].needs_volunteers + " volunteers!";
    volunteers.setAttribute("style", "font-weight: bold");
    volunteers.style.marginBottom = "10px";​
    const funds = document.createElement("h6");
    funds.innerHTML = "Needs " + data[0].funds + "$!";
    funds.setAttribute("style", "font-weight: bold");​
    const button2 = document.createElement("button");
    button2.type = "button";
    button2.setAttribute("class", "btn btn-primary btn-sm");
    button2.setAttribute("onclick", `joinProject("${data[0].name}")`)
    button2.id = data[0].name;
    if (activeBtn == 1) {
        button2.disabled = false;
        button2.innerHTML = "Join!";
    } else if (activeBtn == 0) {
        button2.disabled = true;
        button2.innerHTML = "Joined";
    }​​
    const button3 = document.createElement("button");
    button3.type = "button";
    button3.setAttribute("class", "btn btn-primary btn-sm")
    button3.classList.add("card-link");
    button3.id = "donate";
    button3.innerHTML = "Donate!";​
    div4.appendChild(volunteers);
    div4.appendChild(button2);
    div4.appendChild(funds);
    div4.appendChild(button3);​
    div3.appendChild(h4);
    div3.appendChild(h6);
    div3.appendChild(desc);
    div3.appendChild(div4);​
    div2.appendChild(div3);
    div2.appendChild(divImg);​
    div1.appendChild(div2);
    root.appendChild(div1);​​
    fetch("https://api.unsplash.com/search/photos?query=volunteers&client_id=RGiYuZ7Zg4StPMKGqwtASLom8qf4VkLZWSqNIflsH5c")
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            displayImages(data.results)
        })
        .catch(err => console.log(err))
};​
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
        // console.log(data);
    }​
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
            // to refresh the page after join the project
            fetch(`http://localhost:3000/infoProject${document.location.search}`)
                .then(res => res.json())
                .then(data => {
                    // console.log(data);
                    createInfo(data, 0);
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}
const getData = () => {
    fetch('http://localhost:3000/all_projects')
        .then(res => res.json())
        .then(data => showData(data))
        .catch(err => console.log(err))
}

const showData = (data) => {
    const root = document.getElementById('container');
    data.forEach(project => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.width = '18rem';
        const card_body = document.createElement('div');
        card_body.className = 'card-body';
        const title = document.createElement('h5');
        title.className = 'card-title';
        const title = document.createElement('h5');
        const subtitle = document.createElement('h6');
        const description = document.createElement('p');
        const link = document.createElement('a');

        card_body.appendChild(title)
        card_body.appendChild(subtitle)
        card_body.appendChild(description)
        card_body.appendChild(link)
        card.appendChild(card_body)
        root.appendChild(card)
    })
}
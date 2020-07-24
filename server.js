const exp = require('express');
const cors = require('cors');
const bp = require('body-parser');
const pws = require('p4ssw0rd');
const knex = require('knex');
const fs = require('fs');
const { lemonchiffon } = require('color-name');

const app = exp();

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: '5432',
        user: 'postgres',
        password: 'postgres2626', // MODIFY THIS
        database: 'volunteer' // MODIFY THIS
    }
});



app.use(exp.static(__dirname + '/public'));
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(cors());

app.get('/projects', (req, res) => {
    db('projects')
        .select('*')
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err);
        })
})

app.get('/infoProject', (req, res) => {
    console.log(req.query.name);
    db('projects')
        .select('*')
        .where('name', '=', req.query.name)
        .then(data => {
            console.log(data[0]);
            db('adherents').count('user_id').where('project_id', '=', data[0].project_id)
                .then(count => {
                    console.log(count);
                    if (count.length > 0) {
                        data.push(count[0])
                        db('adherents').select('user_id').where({
                            user_id: 2,
                            project_id: data[0].project_id
                        })
                            .then(user => {
                                if (user.length == 1) {
                                    data.push(0)
                                } else {
                                    data.push(1)
                                }
                                res.send(data);
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    } else {
                        data.push(0);
                        data.push(1);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
})


app.post('/addProject', (req, res) => {
    const { name, resume, local, volunteers, funds, image } = req.body;
    db('projects')
        .insert({
            name: name,
            description: resume,
            status: 'open',
            funds: funds,
            needs_volunteers: volunteers,
            localisation: local,
            image: image,
            creator_id: 2 // MODIFY THIS
        })
        .then(data => {
            // console.log(data);
            res.send(req.body)
        })
        .catch(err => {
            console.log(err);
        })

    // console.log(req.body);
    // res.send(req.body)
})

app.post('/joinProject', (req, res) => {
    console.log(req.body);
    const { user, name, date } = req.body;
    db('adherents')
        .insert({
            user_id: db('users').select('user_id').where('username', '=', user),
            project_id: db('projects').select('project_id').where('name', '=', name),
            add_date: date
        })
        .then(data => {
            // console.log(data);
            res.send({ message: "You join the project! Congrats!" })
        })
        .catch(err => {
            console.log(err);
        })
})


app.listen(3000);






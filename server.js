const exp = require('express');
const cors = require('cors');
const bp = require('body-parser');
const pws = require('p4ssw0rd');
const knex = require('knex');
const fs = require('fs');
const DB = require('./db');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { isNull } = require('util');

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
app.use(exp.static(__dirname + '/ressources'));

app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(cors());
app.use(cookieParser());

app.use(
    session({
        key: 'user_sid',
        secret: 'some_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 1000000
        }
    })
);


const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/projects');
    } else {
        next();
    }
};

app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

app.get('/login', sessionChecker, (req, res) => {
    console.log("login");
    res.sendFile(__dirname + '/public/login.html');
})
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    //selecting the corresponding username in the users table and checking if the password is the same
    DB.findUser(req.body)
        .then(user => {
            if (!user) {
                console.log("BAD USER")
                res.redirect('/login');
            } else {
                console.log(`GOOD USER`);
                console.log(user[0].username);
                req.session.user = user[0];
                //req.session.user = user[0];
                // res.redirect('/projects');
                // res.sendFile(__dirname + '/public/AllProjects.html');
                res.writeHead(302, { 'Location': 'http://localhost:3000/AllProjects.html' });
                res.end();
            }
        })
        .catch(error => {
            res.redirect('/login');
        });
})

app.get('/register', sessionChecker, (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
})
app.post('/register', (req, res) => {
    const { firstname, lastname, email, country, city, street, username, password } = req.body;
    // console.log(req.body);
    DB.createUser(req.body)
        .then(user => {
            res.redirect('/login');
        })
        .catch(error => {
            console.log(error)
            res.redirect('/register');
        });
})

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

app.get('/myProjects', (req, res) => {
    // console.log(req.session.user);
    db('adherents')
        .select('project_id')
        .where('user_id', '=', req.session.user.user_id)
        .then(data => {
            // console.log(data.json());
            // console.log(data);
            // data[0].json();
            let project = [];
            data.forEach(el => {
                project.push(el.project_id)
            });
            // console.log(project);
            db('projects')
                .select('*')
                .where('project_id', 'in', project)
                .orWhere('creator_id', '=', req.session.user.user_id)
                .then(results => {
                    res.send(results);
                })
                .catch(err => {
                    console.log(err);
                })

        })
        .catch(err => {
            console.log(err);
        })
})

app.get('/infoProject', (req, res) => {
    // console.log(req.query.name);
    db('projects')
        .select('*')
        .where('name', '=', req.query.name)
        .then(data => {
            // console.log(data[0]);
            db('adherents').count('user_id').where('project_id', '=', data[0].project_id)
                .then(count => {
                    console.log(count);
                    if (count.length > 0) {
                        data.push(count[0])
                        db('adherents').select('user_id').where({
                            user_id: req.session.user.user_id,
                            project_id: data[0].project_id
                        })
                            .then(user => {
                                console.log(user);
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
            creator_id: req.session.user.user_id
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
    const { name, date } = req.body;
    db('adherents')
        .insert({
            user_id: db('users').select('user_id').where('username', '=', req.session.user.username),
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

app.post('/donateProject', (req, res) => {
    console.log(req.body);
    const { name, donation } = req.body;
    //check if the user is an adherent or not
    db('adherents')
        .select('user_id', 'project_id', 'amount_given').where({
            user_id: req.session.user.user_id,
            project_id: db('projects').select('project_id').where('name', '=', name)
        })
        .then(adherent => {
            if (adherent.length == 0) {
                //create a new adherent entry with the donation given
                db('adherents')
                    .insert({
                        user_id: req.session.user.user_id,
                        project_id: db('projects').select('project_id').where('name', '=', name),
                        amount_given: donation
                    })
                    .then(data => {
                        //update the actual funds of the project
                        db('projects').select('actual_funds').where('name', '=', name)
                            .then(data => {
                                // console.log(data);
                                let project_amount = 0;
                                if (data[0].actual_funds == null) {
                                    project_amount = parseInt(donation);
                                } else {
                                    project_amount = parseInt(data[0].actual_funds) + parseInt(donation);
                                }
                                // console.log(project_amount);

                                db('projects').where('name', '=', name).update('actual_funds', project_amount)
                                    .then(data => { res.send({ message: "Thank you for this wonderful donation !" }) })
                            })
                    })
                    .catch(e => console.log(e))
            } else {
                //means this user is already a member or donated before
                //we need to update the total amount he actually donated
                //and the new total amount that the project got
                console.log(adherent[0].amount_given == null);
                let new_amount = 0;
                if (adherent[0].amount_given == null) {
                    new_amount = parseInt(donation);
                } else {
                    new_amount = parseInt(adherent[0].amount_given) + parseInt(donation);
                    // console.log(new_amount);
                }
                db('adherents')
                    // .where('project_id', '=', adherent[0].project_id)
                    .update('amount_given', new_amount)
                    .then(data => {
                        db('projects').select('actual_funds').where('name', '=', name)
                            .then(data => {
                                let project_amount = 0;
                                if (data[0].actual_funds == null) {
                                    project_amount = parseInt(donation);
                                } else {
                                    project_amount = parseInt(data[0].actual_funds) + parseInt(donation);
                                }
                                db('projects').where('name', '=', name).update('actual_funds', project_amount)
                                    .then(data => { res.send({ message: "Thank you for this wonderful donation !" }) })
                            })
                    })
                    .catch(e => console.log(e))
            }
        })
})

app.get('/forum', (req, res) => {
    db('projects')
        .select('project_id')
        .where('name', '=', req.query.name)
        .then(data => {
            db('forum').select('*').where('project_id', "=", data[0].project_id).orderBy('msg_id')
                .then(data => {
                    res.send(data)
                })
        })
        .catch(err => { console.log(err) })
})
app.post('/forum', (req, res) => {
    // console.log(req.query.name);
    const { message } = req.body;
    db('projects')
        .select('project_id')
        .where('name', '=', req.query.name)
        .then(data => {
            // console.log("data from forum post", data);
            db('forum').insert({
                user_id: req.session.user.user_id,
                project_id: data[0].project_id,
                message: message
            })
                .then(data => {
                    // console.log(data);
                    res.send({ message: "Message added successfully !" })

                })
                .catch(e => {
                    console.log(e)
                })
        })
        .catch(err => { console.log(err) })
})

app.get('/getusername', (req, res) => {
    db('users').select('username').where('user_id', '=', req.query.id)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            console.log(err);
        })
})

/////////////////////////

app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});


app.get('/user_profile', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/user_profile.html');
    } else {
        res.redirect('/login');
    }
})

// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
})

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})




app.listen(3000);






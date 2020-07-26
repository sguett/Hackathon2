const exp = require('express');
const cors = require('cors');
const bp = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const DB = require('./db');
const knex = require('knex');

const app = exp();

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: '5432',
        user: 'postgres',
        password: 'alex1997',
        database: 'volunteer'
    }
});

// set our application port
app.set('port', 9000);

app.use(exp.static(__dirname + '/public'));

// initialize body-parser to parse incoming parameters
// requests to req.body
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(cors());

// initialize cookie-parser to allow us access
// the cookies stored in the browser.
app.use(cookieParser());

// initialize express-session to allow us track
// the logged-in user across sessions.
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

// This middleware will check if user's cookie is still saved
// in browser and user is not set, then automatically log
// the user out.
// This usually happens when you stop your express server
// after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});


// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/all_projects');
    } else {
        next();
    }
};

// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

//The login route
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    })
    .post((req, res) => {
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
                    res.redirect('/all_projects');
                }
            })
            .catch(error => {
                res.redirect('/login');
            });
    })

app.route('/register')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    })
    .post((req, res) => {
        const { firstname, lastname, email, country, city, street, username, password } = req.body;
        DB.createUser(req.body)
            .then(user => {
                res.redirect('/login');
            })
            .catch(error => {
                console.log(error)
                res.redirect('/register');
            });
    })

app.route('/all_projects')
    .get((req, res) => {
        if (req.session.user && req.cookies.user_sid) {
            console.log('Good user session')
            db('projects')
                .select('*')
                .then(data => {
                    res.write(data);
                    res.end();
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            res.redirect('/login');
        }
    })
    .post((req, res) => {
        const { name, resume, local, volunteers, funds, image } = req.body;
        DB.db('projects')
            .insert({
                name: name,
                description: resume,
                status: 'open',
                funds: funds,
                needs_volunteers: volunteers,
                localisation: local,
                image: image,
                creation_date: new Date(),
                creator_id: req.sessin.user.id // MODIFY THIS
            })
            .then(data => {
                // console.log(data);
                res.send(req.body)
            })
            .catch(err => {
                console.log(err);
            })
    });

app.route('/user_profile')
    .get((req, res) => {
        if (req.session.user && req.cookies.user_sid) {
            res.sendFile(__dirname + '/public/user_profile.html');
        } else {
            res.redirect('/login');
        }
    });

app.get('/infoProject', (req, res) => {
    DB.db('projects')
        .select('*')
        .where('name', '=', req.query.name)
        .then(data => {
            // console.log(data);
            res.send(data);
        })
        .catch(err => {
            console.log(err);
        })
})


// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});


// route for handling 404 requests(unavailable routes)
app.use(function(req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

// start the express server
app.listen(app.get('port'), () => {
    console.log(`App started on port ${app.get('port')}`)
});
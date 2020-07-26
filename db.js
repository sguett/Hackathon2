const knex = require('knex');
const pws = require('p4ssw0rd');

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

const findUser = ({ username, password }) => {
    return db('users')
        .where({ 'username': username })
        .select('user_id', 'password')
        .then(data => {
            if (data.length > 0) {
                const pass = data[0].password;
                if (pws.check(password, pass, 10)) {
                    //The username match with the password
                    console.log('Good user')
                    return db('users')
                        .select('*')
                        .where('user_id', data[0].user_id)
                }
            }
        })
        .catch(err => {
            console.log(err);
            return err;
        })
}

const createUser = async({ firstname, lastname, email, country, city, street, username, password }) => {
    return db('users')
        .select('mail', 'username', 'password')
        .where({ "username": username })
        .then(data => {
            if (data.length > 0) {
                res.send({ message: `Key (username)=${data[0].username} already exists.` })
            } else {
                console.log('STARTING USER INSERTION')
                return db('users')
                    .insert({
                        first_name: firstname,
                        last_name: lastname,
                        mail: email,
                        username: username,
                        password: pws.hash(password, 10),
                        country: country,
                        created_date: new Date()
                    })

            }
        })
        .catch(err => {
            return err;
        });
}


const showProjects = () => {
    return db('projects')
        .select('*')
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err);
        })
}
module.exports = {
    findUser,
    createUser,
    showProjects,
    db
}
const express = require('express')
const router = express.Router()
let bcrypt = require('bcrypt')

router.get('/', function (req, res) {
    let userLoggedIn = false
    if (req.session.userStatus === "loggedIn") {
        userLoggedIn = true;
    }

    res.render('pages/createAccount', { userLoggedIn: userLoggedIn, userAlreadyExists: false });
});


router.post('/', function (req, res) {
    let userLoggedIn = false;
    if (req.session.userStatus === "loggedIn") {
        userLoggedIn = true;
    }

    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var email = req.body.email;
    var organisation = req.body.organisation;
    var occupation = req.body.occupation;

    if (regex.test(email)) {
        bcrypt.hash(req.body.password, 10, function (err, hashedPassword) {
            req.knex('registered_users')
                .insert({
                    email: email,
                    password: hashedPassword,
                    organisation: organisation,
                    occupation: occupation
                })
                .then(() => {
                    res.redirect('/login');
                })
                .catch((err) => {
                    res.status(400).json({message: "User with that email already exists"});
                });
        });
    }
    else {
        res.status(400).json({message: "Invalid email"});
        //res.render('pages/createAccount', { userLoggedIn: userLoggedIn, userAlreadyExists: false });
    }
});

module.exports = router;
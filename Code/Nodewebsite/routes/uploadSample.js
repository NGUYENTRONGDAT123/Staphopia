var express = require('express')
var router = express.Router()

// advanced search page
router.get('/', function (req, res) {
    let userLoggedIn = false;
    if (req.session.userStatus === "loggedIn") {
        userLoggedIn = true;
    }

    res.render('pages/uploadSample', { userLoggedIn: userLoggedIn });
});

module.exports = router;
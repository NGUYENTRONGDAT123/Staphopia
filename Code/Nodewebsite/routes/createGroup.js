var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    let userLoggedIn = false;
    let groups = [];
    let hasGroups = false;

    if (req.session.userStatus === "loggedIn"){
        userLoggedIn = true;
        res.render("pages/createGroup", {
            userLoggedIn: userLoggedIn,
            groupAlreadyExists: false,
        });
    }
});

router.post("/", function (req, res) {
    if (req.session.userStatus === "loggedIn") {
        userLoggedIn = true;
    }

    let value = req.session.userEmail;
    let email = decodeURIComponent(value);
    var name = req.body.name;
    var description = req.body.description;
    let date = new Date(Date.now()).toISOString();
    let created = JSON.stringify(date);

    if (name !== "") {
        req.knex
            .select("*")
            .from("groups")
            .where({ name: name })
            .then((result_groups, err) => {
                console.log(result_groups, err);

                //return knex('registered_users').where
                if (result_groups.length != 0) {
                    console.log("Group already exists");
                    res.render("pages/createGroup", {
                        userLoggedIn: userLoggedIn,
                        groupAlreadyExists: true,
                    });
                    return;
                } else {
                    req
                        .knex("groups")
                        .insert({
                            email: email,
                            name: name,
                            description: description,
                            created: created,
                            modified: created,
                        })
                        .then((result_groups, error) => {
                            console.log(result_groups, error);
                            if (error) {
                                throw error;
                                res.redirect("/");
                            } else {
                                res.redirect("/groups");
                            }
                        });
                }
            });
    } else {
        res.render("pages/createGroup", {
            userLoggedIn: userLoggedIn,
            groupAlreadyExists: false,
        });
    }
});
module.exports = router;

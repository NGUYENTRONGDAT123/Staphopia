var express = require('express')
var router = express.Router()

router.post('/', function (req, res) {
    let userEmail = decodeURIComponent(req.session.userEmail);
    let groupId = req.body.groupId;
    let email = req.body.email;
    console.log(groupId);
    console.log(email);

    req.knex('group_sharing')
        .insert({
            group_id: groupId,
            share_to_email: email
        })
        .then(() => {
            //console.log("Inserted")
            req.knex('groups')
                .where({group_id: groupId})
                .update({modified: new Date(Date.now()).toISOString()})
                .then(() => {
                    console.log("Success");
                    res.status(200).json({"message": "User successfully added to group"});
                    return;
                })
                .catch((err) => {
                    console.log("error updating")
                    res.status(401).json({"message": "Error updating group"})
                    return;
                })
              return;
            }
        )
        .catch((err) => {
            console.log("error adding");
            console.log(err);
            res.status(401).json({"message": "Error adding user to group"})
            return;
        });
})


module.exports = router;

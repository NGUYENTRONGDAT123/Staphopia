var express = require('express')
var router = express.Router()

router.post('/', function (req, res) {

    let groupId = req.body.groupId;
    let email = req.body.email;

    req.knex('group_sharing')
      .where({group_id: groupId, share_to_email: email})
      .del()
      .then(() => {
        res.status(200).json({"message": "user successfully removed from group"})
        return;
      })
      .catch((err) => {
        console.log(err);
        res.status(401).json({"message": "error deleting user from group"})
        return;
      });
      return;
      
})

module.exports = router;

var express = require('express');

/* Setup middleware to check user's login and has editting rights
* At the moment two separate ones are used as view groups
* render page while this one is used only for
* back end only operations.
*/
function checkUserLoggedIn (req, res, next) {
    req.userLoggedIn = false;
    if ( !req.session.userStatus === "loggedIn") {
        res.status(403).json({"message": "permissions error - user not logged in"})
        return;
    }
    req.userLoggedIn = true;
    next();
}

function checkUserHasAccess(req, res, next) {
  req.allowedAccess = false;
  let groupId = req.body.groupId;
  let userEmail = decodeURIComponent(req.session.userEmail);
  let truncatedGroups = req.knex
                          .select('group_id', 'email')
                          .from('groups');

  let collaboratorSummary = req.knex
                               .select('*')
                               .from({groups: truncatedGroups})
                               .union(function() {
                                 this.select({group_id: 'group_id', email: 'share_to_email'}).from('group_sharing')
                               });

  // Check user has editting rights
  req.knex
      .select('*')
      .from({summary: collaboratorSummary})
      .where({group_id: groupId || 0})
      .andWhere({email: userEmail || ""})
      .then((collaborators)=> {
        console.log(collaborators)
        if (collaborators.length < 1) { // Fix for async
          res.status(403).json({"message": "permissions error - user does not have access to groups"})
          return;
        }
        console.log("Setting allowedAccess as true")
        req.allowedAccess = true;
        next();
      });

}

const authenticateUserEdit = [checkUserLoggedIn, checkUserHasAccess];

module.exports = authenticateUserEdit;

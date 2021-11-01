var express = require('express')
var router = express.Router()
let url = require('url')


router.get('/', function (req, res, next) {
    let groupId = req.query.groupId;
    let errorPageConfig = { description: 'group', query: 'groupId', id: groupId, endpoint: '/viewGroup', userLoggedIn: req.userLoggedIn };
    //console.log(errorPageConfig);
    if (req.allowedAccess == true) {
      try {
        let getGroupsInfo = req.knex
                                .select('*')
                                .from('groups')
                                .where({group_id: groupId || 0});

        let getSampleIds = req.knex
                              .select('sample_id')
                              .from('group_samples')
                              .where({group_id: groupId || 0});

        let getSharingInfo = req.knex
                             .select('share_to_email')
                             .from('group_sharing')
                             .where({group_id: groupId || 0})


        Promise.all([getGroupsInfo, getSampleIds, getSharingInfo]).then(function([groupInfo, sampleIds, sharingInfo]) {
          groupInfo = groupInfo[0];
          if (sampleIds.length < 1) {
            sampleIds = [ { sample_id: -1 } ];
          }
          let status = "Your"; // Tag group status for user
          if (sharingInfo.length >= 1) {
            status = "Private";
            //console.log(sharingInfo);
            let cleanedSharingInfo = [];
            sharingInfo.forEach(function(share) {
              cleanedSharingInfo.push(share.share_to_email);
              //console.log(share.share_to_email);
              if (share.share_to_email == "_public_all_users_") {
                status = "Public";
                //sharingInfo = [];
                //console.log("set to public");
              }
            });
            sharingInfo = cleanedSharingInfo;
          }
          groupInfo.status = status;
          req.knex.select({st: 'mlst_mlst.st', sample_id: 'sample_metadata.sample_id', metadata: 'sample_metadata.metadata',
          name: 'sample_sample.name', id: 'sample_sample.id'})
              .from('mlst_mlst')
              .innerJoin('sample_sample', 'mlst_mlst.sample_id', 'sample_sample.id')
              .innerJoin('sample_metadata', 'mlst_mlst.sample_id', 'sample_metadata.sample_id')
              .modify(function (queryBuilder) {
                  queryBuilder.where('mlst_mlst.sample_id', sampleIds[0].sample_id || 0);
                  for (i = 1; i < sampleIds.length; i++) {
                    queryBuilder.orWhere('mlst_mlst.sample_id', sampleIds[i].sample_id);
                  }
              })
              .then((sampleInfos) => {
                //console.log(sampleInfos);
                for(sampleInfo of sampleInfos) {
                  sampleInfo.country = sampleInfo.metadata.country;
                  sampleInfo.strain = sampleInfo.metadata.strain;
                  sampleInfo.host = sampleInfo.metadata.host;
                  sampleInfo.isolation_source = sampleInfo.metadata.isolation_source;
                }

                if (groupInfo == undefined) {
                  res.render('pages/error', errorPageConfig);
                  return;
                }
                //console.log(sharingInfo);

                res.render('pages/viewGroup', {
                    userLoggedIn: req.userLoggedIn,
                    samples: sampleInfos,
                    groupInfo: groupInfo,
                    sharingInfo: sharingInfo,
                    email: req.session.userEmail
                });
              });
        })
        .catch(function(err) {
          console.log(err);
          res.render('pages/error', errorPageConfig);
        });

      } catch (err) {
          res.render('pages/error', errorPageConfig);
      }
    }
    else{
        console.log("User does not have permission to access group");
        res.render('pages/error', errorPageConfig);
    }
    return;
})


router.post('/removeGroup', function (req, res) {
  let userLoggedIn = req.session.userStatus === "loggedIn";
  let groupId = req.body.groupId;
  //console.log(groupId);

  //console.log(userLoggedIn);
  if (userLoggedIn) {

    //console.log("=============================================================");
    req.knex('groups')
      .where({ group_id: groupId })
      .del()
      .then(() => {
        //console.log("GROUP DELETED")
        res.status(200).json({"message": "successfully removed group"})
        return;
      })
      .catch((err) => {
        console.log(err);
        res.status(401).json({ "message": "error deleting group" })
        return;
      });
    return;
  }
  res.status(401).json({"message": "permissions error - user not logged in"})
// })
})

module.exports = router;

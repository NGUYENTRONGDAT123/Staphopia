var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
    // Initial values
    let userLoggedIn = false;
    let favorites = [];
    let hasFavs = false;

    if (req.session.userStatus === "loggedIn") {
        userLoggedIn = true;
        let value = req.session.userEmail;
        let email = decodeURIComponent(value);

        req.knex
            .select('*')
            .from('user_favorites')
            .where({email: email})
            .then(favs => {
                req.knex.select({st: 'mlst_mlst.st', sample_id: 'sample_metadata.sample_id', metadata: 'sample_metadata.metadata',
                    name: 'sample_sample.name', id: 'sample_sample.id'}) //TODO: refactor so id is removed
                    .from('mlst_mlst')
                    .innerJoin('sample_sample', 'mlst_mlst.sample_id', 'sample_sample.id')
                    .innerJoin('sample_metadata', 'mlst_mlst.sample_id', 'sample_metadata.sample_id')
                    .modify(function (queryBuilder) {
                        queryBuilder.where('mlst_mlst.sample_id', favs[0].sample_id || 0);
                        for (i = 1; i < favs.length; i++) {
                            queryBuilder.orWhere('mlst_mlst.sample_id', favs[i].sample_id);
                        }
                    })
                    .then((sampleInfos) => {
                        //console.log(sampleInfos);
                        for (sampleInfo of sampleInfos) {
                            sampleInfo.country = sampleInfo.metadata.country;
                            sampleInfo.strain = sampleInfo.metadata.strain;
                            sampleInfo.host = sampleInfo.metadata.host;
                            sampleInfo.isolation_source = sampleInfo.metadata.isolation_source;
                        }

                        res.render('pages/favourites', { userLoggedIn: userLoggedIn, favorites: sampleInfos, haveFavs: true });
                    });
            });
    }
});

router.post('/', function (req, res) {
    let userLoggedIn = req.session.userStatus === "loggedIn";

    let sampleID = req.body.favouritedSampleID;

    if(userLoggedIn) {
        let value = req.session.userEmail;
        let email = decodeURIComponent(value);

        req.knex('user_favorites')
            .where({email: email, sample_id: sampleID})
            .del()
            .then((deleted) => {
                console.log("Deleted: " + deleted + ' row, with sample_id='+sampleID);
                res.redirect('/favourites');
            })
    }

});

module.exports = router;
var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
    let userLoggedIn = false;
    let option = req.query.searchOption;

    if (req.session.userStatus === "loggedIn") {
        userLoggedIn = true;
    }

    res.locals.input = req.query.searchInput;
    let input = res.locals.input;
    res.locals.option = option;
    res.locals.number = 0;
    res.locals.userLoggedIn = userLoggedIn;

    if (req.query.searchInput) {
        if(option === "Sequence"){
            res.locals.getSamples = req.knex.select('sample_id').from('sample_metadata').where({st: input});
        }
        else if(option === "Location"){
            res.locals.getSamples = req.knex.select('sample_id').from('sample_metadata').whereRaw('metadata->>? ILIKE ?', ['country', '%'+input+'%']);
        }
        else if(option === "Strain Name"){
            res.locals.getSamples = req.knex.select('sample_id').from('sample_metadata').whereRaw('metadata->>? ILIKE ?', ['strain', '%'+input+'%']);
        }
        else if(option === "Host"){
            res.locals.getSamples = req.knex.select('sample_id').from('sample_metadata').whereRaw('metadata->>? ILIKE ?', ['host', '%'+input+'%']);
        }
        else if(option === "Source"){
            res.locals.getSamples = req.knex.select('sample_id').from('sample_metadata').whereRaw('metadata->>? ILIKE ?', ['isolation_source', '%'+input+'%']);
        }
        else if(option === "Sample"){
            res.locals.getSamples = req.knex.select('sample_id').from('sample_metadata').where({sample_id: input})
        }

        next()
    } else {
        res.redirect('/');
    }
});

router.get('/', function(req, res){
    req.knex.select({st: 'mlst_mlst.st', sample_id: 'sample_metadata.sample_id', metadata: 'sample_metadata.metadata',
        name: 'sample_sample.name', id: 'sample_sample.id'})
        .from('mlst_mlst')
        .innerJoin('sample_sample', 'mlst_mlst.sample_id', 'sample_sample.id')
        .innerJoin('sample_metadata', 'mlst_mlst.sample_id', 'sample_metadata.sample_id')
        .where('mlst_mlst.sample_id', 'in', res.locals.getSamples)
        .then((same_samples) => {
            for (const same of same_samples) {
                same.country = same.metadata.country;
                same.strain = same.metadata.strain;
                same.host = same.metadata.host;
                same.isolation_source = same.metadata.isolation_source;
            }
            let number = res.locals.number + same_samples.length;
            res.render('pages/searchResults', { samples: same_samples, input: res.locals.input, option: res.locals.option, number: number, userLoggedIn: res.locals.userLoggedIn });
        });
})
module.exports = router;
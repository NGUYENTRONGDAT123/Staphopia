var express = require('express')
var router = express.Router()
let url = require('url')

// Returns genetically close samples for pagination functionality on results page.
router.get('/', function (req, res) {
    let sampleID = req.query.sampleSelection;
    let page = req.query.page;
    let orderBy = req.query.orderBy;
    let order = req.query.order; // Either asc or desc
    let min = req.query.min;
    let max = req.query.max;

    if (min === null) {
      min = 0;
    }

    if (max === null ){
      max = 0.015;
    }

    // Set order by to table
    if (orderBy === "geneticDistance") {
      orderBy = "weighted_distance.distance";
    }
    else if (orderBy === "sequenceType") {
        orderBy = "mlst_mlst.st";
    }
    else if (orderBy === "location") {
        orderBy = "sample_metadata.metadata->>'country'";
    }
    else if (orderBy === "strain") {
        orderBy = "sample_metadata.metadata->>'isolation_strain'";
    }
    else if (orderBy === "host") {
        orderBy = "sample_metadata.metadata->>'host'";
    }
    else if (orderBy === "isolationSource") {
        orderBy = "sample_metadata.metadata->>'isolation_source'";
    }

    if (page <= 0) {
      page = 1;
    }

    let genomesPerPage = 100;

    let sample_name = req.knex.select('name').from('sample_sample').where('id', '=', sampleID);
    req.knex.select('sample_sample.id', 'weighted_distance.distance', 'mlst_mlst.st', 'sample_metadata.metadata')
    .from('weighted_distance')
    .innerJoin('sample_sample', 'weighted_distance.comparison_sample', 'sample_sample.name')
    .innerJoin('sample_metadata', 'sample_sample.id', 'sample_metadata.sample_id')
    .innerJoin('mlst_mlst', 'sample_sample.id', 'mlst_mlst.sample_id')
    .where('weighted_distance.selected_sample', '=', sample_name)
    .andWhere('weighted_distance.distance', '>=', min)
    .andWhere('weighted_distance.distance', '<=', max)
    .modify(function (queryBuilder){ // Supports order by .json object value
          if(orderBy.includes('>')){
            //console.log(`${orderBy} ${order}`);
              queryBuilder.orderByRaw(`${orderBy} ${order}`);
          }
          else {
            queryBuilder.orderBy(orderBy, order)
          }
    })
    .limit(genomesPerPage)  // Return only a few genomes at once
    .offset((page - 1 ) * genomesPerPage)
    .then((rows) => {
      let mainRelatedSampleDetails = [];
      rows.forEach(function (row) {
          var detailedRow = {};
          detailedRow.id = row.id;
          detailedRow.distance = row.distance;
          detailedRow.st = row.st;
          detailedRow.country = row.metadata.country;
          detailedRow.strain = row.metadata.strain;
          detailedRow.host = row.metadata.host;
          detailedRow.isolation_source = row.metadata.isolation_source;
          mainRelatedSampleDetails.push(detailedRow);
      })
      res.json({"closeSamples" : mainRelatedSampleDetails});
    })
    .catch((err) => {
      console.log(err);
        res.json({"Error" : true, "Message" : "Error executing query"})
    });
})

router.get('/count', function (req, res) {
    let sampleID = req.query.sampleSelection;
    let min = req.query.min;
    let max = req.query.max;

    if (min === null) {
      min = 0;
    }

    if (max === null ){
      max = 0.015;
    }

    let sample_name = req.knex.select('name').from('sample_sample').where('id', '=', sampleID);
    req.knex.count('distance')
    .from('weighted_distance')
    .where('selected_sample', '=', sample_name)
    .andWhere('distance', '>=', min) 
    .andWhere('distance', '<=', max)
    .then((numSamples) => {
      res.json({"numSamples" : numSamples});
    })
    .catch((err) => {
      console.log(err);
        res.json({"Error" : true, "Message" : "Error executing count query"})
    });
})

module.exports = router;

const express = require('express');
const app = express();
const reload = require('reload');
const http = require('http');

app.use(express.static(__dirname + '/views/'));

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8080);
const indexRoute = express.Router();
indexRoute.get('/', (req, res) => {
  res.render('index', {
    name: 'Huy',
  });
});

app.use('/', indexRoute);

const server = http.createServer(app);

reload(app)
  .then((reloadReturned) => {
    server.listen(app.get('port'), function () {
      console.log('Web server listening on port ' + app.get('port'));
    });
  })
  .catch(function (err) {
    console.error(
      'Reload could not start, could not start server/sample app',
      err
    );
  });

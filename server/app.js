const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// app.use(require('cors')());

const addRoute = (name) => {
    let route = require('./routes/' + name);
    app.use('/' + name, route);
};

addRoute('apartment');
addRoute('user');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// Last route hit, nothing found
app.use(function(req, res, next) {
  res.status(404);

  /*if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }*/

  // respond with json
  if (req.accepts('json')) {
    res.json({ error: 'Not found' });
    return;
  }
});

app.listen(port, () => {
    console.log(`\nComplex app listening at http://localhost:${port}\n`);
});

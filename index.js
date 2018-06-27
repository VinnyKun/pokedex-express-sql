const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const pg = require('pg');

// Initialise postgres client
const configs = {
  user: 'hi',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
};

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Routes
 * ===================================
 */

 /*
    *************************************************************
    *************************************************************
                    All Pokemon Homepage
    *************************************************************
    *************************************************************

*/

app.get('/', (req, response) => {
  // query database for all pokemon

  // respond with HTML page displaying all pokemon
  //
  const queryString = 'SELECT * from pokemon'

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('query error1:', err.stack);
    } else {
      console.log('query result:', result);

      var context = {
        pokemon: result.rows
      }
      console.log(context);
      // redirect to home page
      response.render('Home', context );
    }
  });

});

/*
    *************************************************************
    *************************************************************
                    Search Pokemon
    *************************************************************
    *************************************************************

*/


app.get('/pokemon/:id', (req, response) => {
  // query database for pokemon by ID

  // respond with HTML page displaying details for that pokemon
  const queryString = 'SELECT * FROM pokemon WHERE id=' + req.params.id;

  console.log(queryString);

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('query error2:', err.stack);
    } else {
      console.log('query result:', result);

      var context = {
        pokemon: result.rows[0]
      }
      //console.log(context.pokemon);
      // redirect to home page
      response.render('Pokemon', context );
    }
  });

});

/*
    *************************************************************
    *************************************************************
                    Edit Pokemon
    *************************************************************
    *************************************************************

*/

app.get('/pokemon/:id/edit', (request, response) => {
  // respond with HTML page with a form displaying details for that pokemon
  //
  const queryString = 'SELECT * FROM pokemon WHERE id=' + request.params.id;

  console.log(queryString);

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('query error3:', err.stack);
    } else {
      console.log('query result:', result);

      var context = {
        pokemon: result.rows[0]
      }
      
      // redirect to Edit.jsx page
      response.render('Edit', context );
    }
  });
});

app.put('/pokemons/edit/:id', (req, response) => {
  let content = req.body;

  
  const queryString = 'UPDATE pokemon SET num=$1,  name=$2, img=$3, height=$4, weight=$5 WHERE id =$6';
  const values = [content.num,content.name, content.img, content.height, content.weight, req.params.id];
 

  console.log(queryString);
  pool.query(queryString, values, (err, res) => {
    if (err) {
      console.log('query err', err.stack);
    } else {
      console.log('query result:', res);

      // redirect to home page
      response.redirect('/pokemon/'+req.params.id);
      //response.send('hello');
    }
  });
});

/*
    *************************************************************
    *************************************************************
                    Delete Pokemon
    *************************************************************
    *************************************************************

*/



app.delete("/pokemons/edit/:id", (request, response) => {


  const queryString = 'DELETE from pokemon WHERE id =' + request.params.id;

  console.log(queryString);
  pool.query(queryString, (err, res) => {
    if (err) {
      console.log('query error 5', err.stack);
    } else {
      console.log('query result:', res);

      // redirect to home page
      response.redirect('/');
      //response.send('hello');
    }
  });


});


/*
    *************************************************************
    *************************************************************
                    New Pokemon
    *************************************************************
    *************************************************************

*/

app.get('/new', (request, response) => {
  // respond with HTML page with form to create new pokemon
  response.render('New');
});

app.post('/pokemon', (req, response) => {
  let params = req.body;

  const queryString = 'INSERT INTO pokemon(num, name, img, height, weight) VALUES($1, $2, $3, $4, $5)'
  const values = [params.num, params.name, params.img, params.height, params.weight,];

  pool.query(queryString, values, (err, res) => {
    if (err) {
      console.log('query error4:', err.stack);
    } else {
      console.log('query result:', res);

      // redirect to home page
      response.redirect('/');
    }
  });
});


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));

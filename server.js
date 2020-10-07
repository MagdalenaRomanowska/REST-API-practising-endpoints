const express = require('express');
var cors = require('cors');

const app = express(); 
// import routes
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

app.use(cors());//middleware.stoi za funkcjonalnością wykonywania żądań AJAXowych. Jedną z jego ważnych opcji jest również możliwość ograniczania połączeń. Możemy np. ustawić, że nasze API pozwala na połączenie tylko i wyłączne z konkretnej domeny oraz z konkretnych metod, albo – co istotne dla publicznych API – z każdej domeny.
app.use(express.urlencoded({ extended: false }));//Jeśli chcesz mieć obsługę formularzy x-www-form-urlencoded, dodaj middleware express.urlencoded.
app.use(express.json()); //Jeśli dodatkowo chcesz odbierać dane w formacie JSON (mogą być wysyłane za pomocą form-data), to również express.json.
app.use('/api', testimonialsRoutes); // add testimonials routes to server.
app.use('/api', concertsRoutes); // add concerts routes to server.
app.use('/api', seatsRoutes); // add seatsRoutes routes to server.

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' }); 
});

app.listen(8000, () => { 
  console.log('Server is running on port: 8000'); 
});
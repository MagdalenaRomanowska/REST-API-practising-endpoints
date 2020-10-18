const express = require('express');
const path = require('path');
const app = express();
var cors = require('cors');

const server = app.listen(process.env.PORT || 8000, () => { //Teraz lokalnie wciąż będziemy korzystali z portu 8000, ale Heroku na repo zdalnym będzie wykorzystywać informacje zapisane w konfiguracji.
  console.log('Server is running on port: 8000');
});
const socket = require('socket.io'); //uruchamiamy klienta websocketowego. 
const io = socket(server); //Integrujmy z naszym serwerem możliwości oferowane przez paczkę socket.

io.on('connection', () => {
  console.log('New socket!');
});

// import routes
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

app.use(cors());//middleware. Stoi za funkcjonalnością wykonywania żądań AJAXowych. Jedną z jego ważnych opcji jest również możliwość ograniczania połączeń. Możemy np. ustawić, że nasze API pozwala na połączenie tylko i wyłączne z konkretnej domeny oraz z konkretnych metod, albo – co istotne dla publicznych API – z każdej domeny.
app.use(express.urlencoded({ extended: false }));//Jeśli chcesz mieć obsługę formularzy x-www-form-urlencoded, dodaj middleware express.urlencoded.
app.use(express.json()); //Jeśli dodatkowo chcesz odbierać dane w formacie JSON (mogą być wysyłane za pomocą form-data), to również express.json.

app.use((req, res, next) => {//Teraz w każdym pliku, również zewnętrznym, endpointy będą miały dostęp do naszego serwera WebSocket przy użyciu zwykłego obiektu żądania req (a dokładnie req.io).
  req.io = io;
  next();
});

app.use('/api', testimonialsRoutes); // add testimonials routes to server.
app.use('/api', concertsRoutes); // add concerts routes to server.
app.use('/api', seatsRoutes); // add seatsRoutes routes to server.
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));
app.get('*', (req, res) => { //endpoint, który będzie zwracał naszą aplikację. Kod będzie starał się wyłapywać wszystkie możliwe linki, więc gdyby znalazł się przed naszymi endpointami z zewnętrznych plików, przechwytywałby również ich adresy (np. /seats czy /concerts).
  res.sendFile(path.join(__dirname, '/client/build/index.html')); //Od teraz wejście w każdy link, którego serwer nie dopasował do wcześniejszych endpointów, będzie powodować po prostu zwrócenie w przeglądarce naszej reactowej aplikacji.
});
app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

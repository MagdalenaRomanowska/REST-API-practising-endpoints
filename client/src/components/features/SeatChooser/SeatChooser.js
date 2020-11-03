import io from 'socket.io-client'; //importujemy paczkę z node_modules. Możemy ograniczyć się do modułu odpowiedzialnego za możliwości klienta.
import React from 'react';
import { Button, Progress, Alert } from 'reactstrap';
import './SeatChooser.scss';

class SeatChooser extends React.Component {

  componentDidMount() {//emisja jest w seats.routes.js
    const { loadSeats } = this.props;
    loadSeats(); //odświeżanie danych o zajętych miejscach.
    let serverURL = (process.env.NODE_ENV === 'production') ? '' : 'http://localhost:8000';// na podstawie config.js
    this.socket = io(serverURL);//Pamiętaj, że nasz klient może być na innym adresie niż serwer (localhost:3000 – w wersji developerskiej), a czasem na takim samym (localhost:8000 lub serwer Heroku – aplikacja po zbudowaniu). Koniecznie warunkuj połączenie od process.env.NODE_ENV. Jeśli jesteśmy w środowisku production, to niech Socket.IO automatycznie wybierze domyślny adres, w innej sytuacji wskaż jednak localhost:8000.
    this.socket.on('seatsUpdated', (seats) => {//przyjmuje zdarzenie od serwera.
      const { loadSeatsData } = this.props;
      loadSeatsData(seats); //Wykrycie tego eventu powinno powodować wywołanie nowej funkcji (np. updateTasks).
    });
    this.socket.on('ticketsUpdated', (tickets) => {//przyjmuje zdarzenie od serwera.
      const { findFreeSeats } = this.props;
      findFreeSeats(tickets); //Wykrycie tego eventu powinno powodować wywołanie nowej funkcji (np. updateTasks).
    });
  }

  isTaken = (seatId) => {
    const { seats, chosenDay } = this.props;
    return (seats.some(item => (item.seat == seatId && item.day == chosenDay)));
  }

  prepareSeat = (seatId) => {
    const { chosenSeat, updateSeat } = this.props;
    const { isTaken } = this;
    if (seatId === chosenSeat) return <Button key={seatId} className="seats__seat" color="primary">{seatId}</Button>;
    else if (isTaken(seatId)) return <Button key={seatId} className="seats__seat" disabled color="secondary">{seatId}</Button>;
    else return <Button key={seatId} color="primary" className="seats__seat" outline onClick={(e) => updateSeat(e, seatId)}>{seatId}</Button>;
  }

  freeSeats = () => {
    const { seats, chosenDay } = this.props;
    let seatsTaken = seats.filter(i => i.day == chosenDay);
    console.log('seats MADZIA', seats);
    console.log('seatsTaken MADZIA', seatsTaken);
    let seatsTakenLength = seatsTaken.length;
    return 50 - seatsTakenLength;
  }

  render() {

    const { freeSeats, prepareSeat } = this;
    const { requests } = this.props;

    return (
      <div>
        <h3>Pick a seat</h3>
        <small id="pickHelp" className="form-text text-muted ml-2"><Button color="secondary" /> – seat is already taken</small>
        <small id="pickHelpTwo" className="form-text text-muted ml-2 mb-4"><Button outline color="primary" /> – it's empty</small>
        { (requests['LOAD_SEATS'] && requests['LOAD_SEATS'].success) && <div className="seats">{[...Array(50)].map((x, i) => prepareSeat(i + 1))}</div>}
        { (requests['LOAD_SEATS'] && requests['LOAD_SEATS'].pending) && <Progress animated color="primary" value={50} />}
        { (requests['LOAD_SEATS'] && requests['LOAD_SEATS'].error) && <Alert color="warning">Couldn't load seats...</Alert>}
        <h3>Free seats: {freeSeats()}/50
        </h3>
      </div>
    )
  };
}

export default SeatChooser;
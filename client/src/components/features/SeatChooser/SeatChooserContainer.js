import { connect } from 'react-redux';
import { getSeats, getRequests, loadSeatsRequest, loadSeats } from '../../../redux/seatsRedux';
import SeatChooser from './SeatChooser';

const mapStateToProps = state => ({
  seats: getSeats(state),
  requests: getRequests(state),
});

const mapDispatchToProps = dispatch => ({
  loadSeats: () => dispatch(loadSeatsRequest()),
  loadSeatsData: (seats) => dispatch(loadSeats(seats)),//Od tej chwili w komponencie SeatChooser mamy już dostęp do funkcji, która będzie potrafiła zmodyfikować bezpośrednio nasz store reduksowy.
});

export default connect(mapStateToProps, mapDispatchToProps)(SeatChooser);
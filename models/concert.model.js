const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({//W schemacie ustalamy, że dane powinny mieć 2 atrybuty. Oba są obowiązkowe (required: true). 
    //_id = jego wartość jest nadawana automatycznie przez MongoDB, więc powinna zawsze być poprawna. 
    //Dlatego też możemy go w ogóle pominąć w schemacie (zakomentowałam):
    // _id: { type: mongoose.Types.ObjectId, required: true }, //oczekiwany typ to ObjectId.
    id: { type: String, required: true },
    performer: { type: String, required: true }, 
    genre: { type: String, required: true },
    price: { type: String, required: true },
    day: { type: String, required: true },
    image: { type: String, required: true }
});

module.exports = mongoose.model('Concert', concertSchema);
//1szy parametr mówi nam jak nazywa się model, a 2gi określa z jakiego schematu struktury danych ma korzystać.
//Skąd Mongoose wie jakiej kolekcji tyczy się model?
// Mongoose zakłada, że model tyczy się tej kolekcji, której nazwa jest równa nazwie modelu, ale pisanej 
//z małych liter i zakończonej literą "s". Zatem jeśli nasz model nazywa się Concert, to Mongoose 
//powiąże go z kolekcją danych concerts. Jeśli taka kolekcja jeszcze by nie istniała, to zostałaby 
//automatycznie utworzona.
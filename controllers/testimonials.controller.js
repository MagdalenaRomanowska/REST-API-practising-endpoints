const Testimonial = require('../models/testimonial.model');

exports.getAll = async (req, res) => {
    try {
        res.json(await Testimonial.find());
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
};

exports.getById = async (req, res) => {
    try {
        const dep = await Testimonial.findById(req.params.id);
        if (!dep) res.status(404).json({ message: 'Not found' });
        else res.json(dep);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
};

exports.getRandom = async (req, res) => {
    try {
        const count = await Testimonial.countDocuments();//countDocuments zlicza ilość wszystkich dokumentów w kolekcji.
        const rand = Math.floor(Math.random() * count);//losujemy liczbę, ale taką, która nie będzie większa od ilości dokumentów.
        const dep = await Testimonial.findOne().skip(rand);//wybrać bezwarunkowo jeden element. Metoda skip zapewnia 
        //nas, że wyszukiwanie będzie rozpoczynane z różnego miejsca. Jeśli rand=1, to rozpoczynamy wyszukiwanie od 
        //1go dokumentu. Ten od razu pasuje do warunku, więc zostanie zwrócony. Jeśli jednak rand=100, to wyszukiwanie 
        //pasującego elementu zacznie się od dokumentu nr 100 i to on będzie zwrócony jako 1szy pasujący. 
        if (!dep) res.status(404).json({ message: 'Not found' });//Na końcu upewniamy się, czy udało się coś 
        else res.json(dep);// znaleźć (kolekcja może być pusta) i zwracamy znaleziony element lub błąd.
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
};

exports.put = async (req, res) => {
    const { id, author, text } = req.body;
    try {
        const dep = await (Testimonial.findById(req.params.id));
        if (dep) {
            dep.id = id;
            dep.author = author;
            dep.text = text;
            await dep.save();
            res.json({ message: 'OK' });
        }
        else res.status(404).json({ message: 'Not found...' });
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
};

exports.post = async (req, res) => {
    try {
        const { id, author, text } = req.body;
        const newTestimonial = new Testimonial({ id: id, author: author, text: text });
        await newTestimonial.save();
        res.json({ message: 'OK' });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

exports.delete = async (req, res) => {
    try {
        const dep = await (Testimonial.findById(req.params.id));
        if (dep) {
            await Testimonial.deleteOne({ _id: req.params.id });
            res.json({ message: 'OK' });
        }
        else res.status(404).json({ message: 'Not found...' });
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}; 
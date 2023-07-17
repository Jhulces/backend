const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> [name] [number]');
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://Jhulces:${password}@clusterpb.sovczya.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

mongoose.connect(url)
  .then(() => {
    if (process.argv.length === 3) {
      // Mostrar todos los ítems existentes en la base de datos
      Person.find({})
        .then(people => {
          console.log('phonebook:');
          people.forEach(person => {
            console.log(`${person.name} ${person.number}`);
          });
          mongoose.connection.close();
        })
        .catch(error => {
          console.error('Error:', error.message);
          mongoose.connection.close();
        });
    } else if (process.argv.length === 5) {
      // Añadir nueva entrada a la base de datos
      const name = process.argv[3];
      const number = process.argv[4];

      const newPerson = new Person({
        name: name,
        number: number,
      });

      newPerson.save()
        .then(() => {
          console.log(`added ${name} number ${number} to phonebook`);
          mongoose.connection.close();
        })
        .catch(error => {
          console.error('Error:', error.message);
          mongoose.connection.close();
        });
    } else {
      console.log('Usage: node mongo.js <password> [name] [number]');
      mongoose.connection.close();
    }
  })
  .catch(error => {
    console.error('Connection error:', error.message);
    mongoose.connection.close();
  });

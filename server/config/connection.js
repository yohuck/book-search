const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://ericlake1:SmellyDog424@books.9qvyqbd.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection;

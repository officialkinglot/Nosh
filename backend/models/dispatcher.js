const mongoose = require('mongoose');

const dispatcherSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
});

const Dispatcher = mongoose.model('Dispatcher', dispatcherSchema);

module.exports = Dispatcher;
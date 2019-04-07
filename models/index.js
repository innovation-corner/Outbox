const mongoose = require('mongoose');

module.exports.connect = (uri) => {
  mongoose.connect(uri, {
    useNewUrlParser: true
  });
  // plug in the promise library:
  mongoose.Promise = global.Promise;
  mongoose.set('debug', true);
 
  mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err}`);
    // console.error(`Mongoose connection error: ${err.stack}`);

    process.exit(1);
  });

  // load models
  require('./userModels');

  console.log("DB connected, Build something people love √√√")
  console.log(process.env.MONGO_URI, 'The database')
};
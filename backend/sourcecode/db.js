require('dotenv').config({ path: '.env' });

const mongoose = require('mongoose');

const { DATABASE } = process.env;
const maxAllowedConnectionErrors = 5;
const timeoutConnectionErrors = 5000;
let mongodbErrorCounter = 0;

// MONGOOSE CONNECTION TO MONGO
mongoose.Promise = global.Promise;

const connect = () => mongoose.connect(DATABASE, { useNewUrlParser: true });

mongoose.connection.on('error', err => {
  mongodbErrorCounter += 1;
  if (mongodbErrorCounter >= maxAllowedConnectionErrors) {
    console.log('Terminate process, MongoDB Connection Errors exceeded limit');
    process.exit(1);
  }
  console.log(`MongoDB Connection Error: ${err}`);
  setTimeout(connect, timeoutConnectionErrors);
});

mongoose.connection.on('connected', () => {
  mongodbErrorCounter = 0;
  console.log(`🚀  MongoDB is Connected...`);
});

// MODELS
const dataCounterSchema = new mongoose.Schema({
  value: Number,
});
const DataCounter = mongoose.model('dataCounter', dataCounterSchema);

const getDataCounter = () => {
  const queryPromise = DataCounter.findOne({}).exec();
  return queryPromise.then(result => {
    console.log('DataCounter', result);
    return result;
  });
};

const setDataCounter = value => {
  getDataCounter().then(result => {
    const Data = new DataCounter({ value });
    if (!result) {
      Data.save(error => {
        console.log('DataCounter saved with value: ', value);
        if (error) {
          console.error(error);
          throw error;
        }
      });
    } else {
      console.log('Found data:', result);
      DataCounter.findByIdAndUpdate(
        result._id,
        { value },
        { new: true, useFindAndModify: false },
        (err, doc) => {
          console.log('Update DB Document:', doc);
          return doc;
        }
      );
    }
  });
};

module.exports = {
  connect,
  getDataCounter,
  setDataCounter,
};

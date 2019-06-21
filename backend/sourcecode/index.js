require('dotenv').config({ path: '.env' });

const app = require('./app');
const db = require('./db');

const { PORT } = process.env;

// APP INITIALIZATION - STARTING SERVER... 🚀
app.set('port', PORT);

app.listen(app.get('port'), () => {
  console.log('------------------------------------------------------------');
  console.log(`🚀  GeekSessions Backend API: listening on PORT ${PORT}!`);
  console.log('------------------------------------------------------------');
});

// DB CONNECT
db.connect();

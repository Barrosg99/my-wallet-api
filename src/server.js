const app = require('./app');
require('dotenv').config();

const port = process.env.PORT || process.env.SRV_PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
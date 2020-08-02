const app = require("./config/server");
const vars = require("./config/vars");

//
app.listen(
  {
    port: process.env.PORT,
  },
  () => console.log(`app listening at http://localhost:${process.env.PORT}`)
);

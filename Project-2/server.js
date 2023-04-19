const express = require("express");
const exphbs = require("express-handlebars");

const db = require("./models");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const htmlRoutes = require("./routes/html-routes");
const peopleRoutes = require("./routes/people-api-routes");
const locationRoutes = require("./routes/location-api-routes");

app.use(htmlRoutes);
app.use(peopleRoutes);
app.use(locationRoutes);

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is live @ http://localhost:${PORT}`);
  });
});

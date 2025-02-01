import app from "./server.js";
import connection from "./database.js";
import dotenv from "dotenv";

dotenv.config();
connection();

app.listen(app.get("port"), () => {
  console.log(`Server ok on http://localhost:${app.get("port")}`);
});

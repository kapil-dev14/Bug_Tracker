import "dotenv/config"; // must be the first import: populates process.env before
import connectDB from "./config/db.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("Express App Error: ", error);
      throw error;
    });

    app.listen(PORT, () => {
      console.log(`⚙️ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed !!! ", err);
  });

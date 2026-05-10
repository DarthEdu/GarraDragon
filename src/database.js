import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

mongoose.set("strictQuery", true);

const connection = async () => {
  try {
    const { connection } = await mongoose.connect(
      process.env.MONGODB_URI_PRODUCTION
    );
    console.log(
      `Database is connected on ${connection.host} - ${connection.port}`
    );
  } catch (error) {
    console.log(error);
  }
};

export default connection;

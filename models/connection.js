const mongoose = require("mongoose");

const connectionString = "mongodb+srv://pgoff:5mLFn9bXYcmEV2Vr@cluster0.df20yl1.mongodb.net/wannaplay?retryWrites=true&w=majority";

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));

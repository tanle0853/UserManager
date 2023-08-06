import app from "./app";
import { startConnection } from "./database";
import mongoose from "mongoose"

mongoose.set('strictQuery', true);
startConnection();
app.listen(3000);
console.log("Server on port", 3000);

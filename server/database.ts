import { connect } from "mongoose";

export const startConnection = async (): Promise<void> => {
  try {
    const db = await connect("mongodb://127.0.0.1:27017/mevn-database");
    console.log(db.connection.name);
  } catch (error) {
    console.error(error);
  }
};

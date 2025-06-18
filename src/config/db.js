import { MongoClient } from "mongodb";
import 'dotenv/config'

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lhqyyek.mongodb.net/`;
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME;

let db;

export const connectDB = async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log('Connected');
    return db;
  } catch (error) {
    console.log(error);
  }
}

export const getDB = () => {
  if (!db) {
    throw new Error('Database not connected') 
  }
  return db;
}
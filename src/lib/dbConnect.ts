import mongoose from "mongoose"

type ConnectionObject = {
    isConnected?: Number
}

const connection: ConnectionObject = {}

/*the below statement shows that The connect function returns a promise of type void type void means it can return anything iam not bothered of it */
async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("The database is already connected");
        return;
    } try {
        const db = await mongoose.connect(process.env.MONGODB_URI!);
        // console.log("The db connections are : ",db.connections)
        connection.isConnected = db.connections[0].readyState
        console.log("DB Connected Successfully");

    } catch (error) {
        console.log("DB connection failed", error);
        process.exit();
    }
}
dbConnect();
export default dbConnect

/*
{
the output of connections[0]: is the below one
  id: 0,
  host: 'localhost',
  port: 27017,
  user: null,
  pass: null,
  name: 'your-database-name',
  readyState: 1, // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
  _connectionString: 'mongodb://localhost:27017/your-database-name',
  ...
}



also we can use a variable to check the db is connected or not like isConnected = 0;
if isConnected == 1 then it is connected else 
establish the connection and set the flag to 1 using the response.connections[0].readySTate
*/
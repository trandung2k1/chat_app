const mongoose = require('mongoose');
const colors = require('colors');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(colors.green('Connected to MongoDB successfully!'));
    } catch (error) {
        console.log(error);
        console.log(colors.red('Connected to MongoDB failed'));
        process.exit(1);
    }
};
process.on('SIGINT', () => {
    (async () => {
        await mongoose.connection.close();
    })();
    console.log(colors.red('Killed server'));
    process.exit(0);
});
module.exports = connectDB;

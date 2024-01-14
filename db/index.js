const mongoose = require('mongoose');

const connectDB = async () => {
try {
    const res = await mongoose.connect('mongodb+srv://Sami:Sami123@cluster0.2bdvuov.mongodb.net/?retryWrites=true&w=majority');
    console.log('MONGODB connected');
    
} catch (err) {
    console.error(err.message);
    process.exit(1);
}
}

module.exports = connectDB;
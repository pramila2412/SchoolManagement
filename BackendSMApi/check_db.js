require('dotenv').config();
const mongoose = require('mongoose');
const GalleryImage = require('./models/GalleryImage');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB successfully!");
        const images = await GalleryImage.find().lean();
        console.log("Total images in database:", images.length);
        console.log(JSON.stringify(images, null, 2));
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

check();

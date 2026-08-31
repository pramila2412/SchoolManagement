const mongoose = require('mongoose');
require('dotenv').config({ override: true });
const School = require('./models/School');
const fs = require('fs');
const path = require('path');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Create SION and KOSI schools if they don't exist
        const sion = await School.findOneAndUpdate(
            { schoolCode: 'SION' },
            { name: 'Sion Nagar', address: 'Sion Nagar Branch', status: 'Active' },
            { upsert: true, new: true }
        );

        await School.findOneAndUpdate(
            { schoolCode: 'KOSI' },
            { name: 'Kosi Colony', address: 'Kosi Colony Branch', status: 'Active' },
            { upsert: true, new: true }
        );
        console.log('Schools seeded.');

        const sionId = sion._id.toString();

        // 2. Iterate over all models and update records where schoolId is missing
        const modelsDir = path.join(__dirname, 'models');
        const files = fs.readdirSync(modelsDir);
        
        let totalUpdated = 0;

        for (const file of files) {
            if (file.endsWith('.js') && file !== 'School.js') {
                const modelPath = path.join(modelsDir, file);
                try {
                    const Model = require(modelPath);
                    if (Model && Model.modelName && Model.updateMany) {
                        const result = await Model.updateMany(
                            { schoolId: { $exists: false } },
                            { $set: { schoolId: sionId } }
                        );
                        if (result.modifiedCount > 0) {
                            console.log(`Updated ${result.modifiedCount} records in ${Model.modelName}`);
                            totalUpdated += result.modifiedCount;
                        }
                    }
                } catch (err) {
                    console.log(`Skipping ${file} due to error or not a standard model`);
                }
            }
        }

        console.log(`Migration complete. Total updated: ${totalUpdated}`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed', err);
        process.exit(1);
    }
}

migrate();

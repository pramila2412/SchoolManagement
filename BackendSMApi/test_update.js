const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    title: String,
    arrays: [String],
    nested: {
        prop1: String,
        prop2: String
    }
}, { timestamps: true });

const TestModel = mongoose.model('TestModel', testSchema);

async function run() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/school_test', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected');
        let doc = await TestModel.create({ title: 'Old', arrays: ['A'], nested: { prop1: 'Old1' } });
        
        const reqBody = {
            _id: doc._id.toString(),
            __v: doc.__v,
            title: 'New',
            arrays: ['A', 'B'],
            nested: { prop1: 'New1', prop2: 'New2' }
        };

        // Test Object.assign
        try {
            let docCopy = await TestModel.findById(doc._id);
            Object.assign(docCopy, reqBody);
            await docCopy.save();
            console.log('Object.assign worked');
        } catch (err) {
            console.error('Object.assign failed:', err.message);
        }

        // Test .set
        try {
            let docCopy2 = await TestModel.findById(doc._id);
            const updateData = { ...reqBody };
            delete updateData._id;
            delete updateData.__v;
            docCopy2.set(updateData);
            await docCopy2.save();
            console.log('.set worked');
        } catch (err) {
            console.error('.set failed:', err.message);
        }

    } catch (err) {
        console.error('Test error:', err);
    } finally {
        await mongoose.disconnect();
    }
}
run();

const mongoose = require('mongoose');


const TestSchema = new mongoose.Schema({

    name: { type: String, required: true },
    age: { type: String, required: true },
    author: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },

},
    { timestamps: true }
)

module.exports = mongoose.model('TestModel', TestSchema, 'test')
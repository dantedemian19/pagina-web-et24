const { Schema, model } = require('mongoose');

const NewsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    extract: {
        type: String
    }
    
},
{
    timestamps: true
});

module.exports = model('New', NewsSchema);
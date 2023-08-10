const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const noteSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    }
)

noteSchema.plugin(AutoIncrement, {
    inc_field : 'ticket',
    id : 'tickedNums',
    start_seq : 500
})

module.exports = mongoose.model('Note', noteSchema)
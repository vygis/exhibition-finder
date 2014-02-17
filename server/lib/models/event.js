/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var EventSchema = new Schema({
    creationDate: {
        type: Date,
        default: Date.now
    },
    lastModificationDate: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    modifier: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    venues: {
        type: Schema.ObjectId,
        ref: 'Venue'
    }
});

/**
 * Validations
 */
EventSchema.path('name').validate(function(name) {
    return name.length;
}, 'Name cannot be blank');

/**
 * Statics
 */
EventSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('creator', 'name username')
            .populate('modifier', 'name username')
            .exec(cb);
    }
};

mongoose.model('Event', EventSchema);
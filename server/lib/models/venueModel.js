/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    modelName = "venue";


/**
 * Venue Schema
 */
var VenueSchema = new Schema({
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
//    creator: {
//        type: Schema.ObjectId,
//        ref: 'User'
//    },
//    modifier: {
//        type: Schema.ObjectId,
//        ref: 'User'
//    },
    events: [{
        type: Schema.ObjectId,
        ref: 'Event'
    }]
});

/**
 * Validations
 */
VenueSchema.path('name').validate(function(name) {
    return name.length;
}, 'Name cannot be blank');

/**
 * Statics
 */
VenueSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        })//.populate('creator', 'name username')
            //.populate('modifier', 'name username')
            .populate('events', 'name')
            .exec(cb);
    }
};

var venueModel = mongoose.model('Venue', VenueSchema);

exports.addModel = function (modelObject) {
    modelObject[modelName] = venueModel;
};
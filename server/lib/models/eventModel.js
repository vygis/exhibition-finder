/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore'),
    modelName = 'event';


/**
 * Event Schema
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
    }, /*
     creator: {
     type: Schema.ObjectId,
     ref: 'User'
     },
     modifier: {
     type: Schema.ObjectId,
     ref: 'User'
     },*/
    venues: [
        {
            type: Schema.ObjectId,
            ref: 'Venue'
        }
    ]
});

/**
 * Validations
 */
EventSchema.path('name').validate(function (name) {
    return name.length;
}, 'Name cannot be blank');

/**
 * Statics
 */

EventSchema.statics = {
    load: function (id, cb) {
        this.findOne({
            _id: id
        })
            //.populate('venues', '_id name')
            .exec(cb);
    },
    loadLinkedToVenue: function (venueId, cb) {
        this.find({ venues: venueId })
            .exec(function (err, events) {
                cb(err, events);
            })
    }
};

var eventModel = mongoose.model('Event', EventSchema);

exports.addModel = function (modelObject) {
    modelObject[modelName] = eventModel
};
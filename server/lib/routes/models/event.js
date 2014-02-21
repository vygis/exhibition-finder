/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore');


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
    }/*,
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
    }*/
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

var eventModel = mongoose.model('Event', EventSchema);

/**
 * Event Methods
 */

var eventMethods = {
    getById: function(req, res, next, id) {
        eventModel.load(id, function(err, event) {
            if (err) return next(err);
            if (!event) return next(new Error('Failed to load event ' + id));
            req.event = event;
            next();
        });
    },
    show: function(req, res) {
        res.jsonp(req.event);
    },
    create: function(req, res) {
        var event = new eventModel(req.body);
        //var event = new eventModel({name:"test event", description:"test description"});
        event.user = req.user || {name: "vygis", username: "vygintas"}; //TODO find out where the user is coming from

        event.save(function(err) {
            if (err) {
//                res.render('error', {
//                    status: 500
//                });
            } else {
                res.jsonp(event);
            }
        });
    },
    update: function(req, res) {
        var event = req.event;

        event = _.extend(event, req.body);

        event.save(function(err) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(event);
            }
        });
    },
    delete: function(req, res) {
        var event = req.event;

        eventModel.remove(function(err) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(event);
            }
        });
    },
    all: function(req, res) {
        eventModel.find().sort('-created').populate('creator', 'name username').exec(function(err, events) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(events);
            }
        });
    },
    test: function(req, res) {
        var test = {test: 123};
        res.jsonp(test);
    }
};



exports.addRoutes = function (app) {
    app.get('/api/events', eventMethods.all);
    app.post('/api/events', eventMethods.create);
    app.get('/api/events/:eventId', eventMethods.show);
    app.put('/api/events/:eventId', eventMethods.update); //TODO add authorisation middleware
    app.del('/api/events/:eventId', eventMethods.delete); //TODO add authorisation middleware
    app.param('eventId', eventMethods.getById);
};
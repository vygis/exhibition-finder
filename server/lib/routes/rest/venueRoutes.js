var createMethods = function (models) {
    var venueModel = models.venue,
        methods = {
            getById: function(req, res, next, id) {
                venueModel.load(id, function(err, venue) {
                    if (err) return next(err);
                    if (!venue) return next(new Error('Failed to load venue ' + id));
                    req.venue = venue;
                    next();
                });
            },
            show: function(req, res) {
                res.jsonp(req.venue);
            },
            create: function(req, res) {
                var venueData = req.body;
//        venueData.events = venueData.events || [];
//        var eventIds = ["5339bb5b8959555c0df4ea12", "5339bb9c8959555c0df4ea13"]; //testEvent
//        eventIds.forEach(function (event) {
//            venueData.events.push(event);
//        });
                var venue = new venueModel(venueData);
                //var venue = new venueModel({name:"test venue", description:"test description"});
                //venue.user = req.user || {name: "vygis", username: "vygintas"}; //TODO find out where the user is coming from
                venue.save(function(err) {
                    if (err) {
                        res.render('error', {
                            status: 500
                        });
                    } else {
                        res.jsonp(venue);
                    }
                });
            },
            update: function(req, res) {
                var venue = req.venue;
                var eventId2 = "5339bb9c8959555c0df4ea13"; //testEvent

                venue = _.extend(venue, req.body);

                venue.save(function(err) {
                    if (err) {
                        res.render('error', {
                            status: 500
                        });
                    } else {
                        res.jsonp(venue);
                    }
                });
            },
            delete: function(req, res) {
                var venue = req.venue;

                venue.remove(function(err) {
                    if (err) {
                        res.render('error', {
                            status: 500
                        });
                    } else {
                        res.jsonp(venue);
                    }
                });
            },
            all: function(req, res) {
                venueModel.find().sort('-created').populate('creator', 'name username').exec(function(err, venues) {
                    if (err) {
                        res.render('error', {
                            status: 500
                        });
                    } else {
                        res.jsonp(venues);
                    }
                });
            }
        }
    return methods;
};

exports.addRoutes = function (app, models) {
    var methods = createMethods(models);
    app.get('/rest/venues', methods.all);
    app.post('/rest/venues', methods.create);
    app.get('/rest/venues/:venueId', methods.show);
    app.put('/rest/venues/:venueId', methods.update); //TODO add authorisation middleware
    app.del('/rest/venues/:venueId', methods.delete); //TODO add authorisation middleware
    app.param('venueId', methods.getById);
};
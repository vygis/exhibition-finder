var createMethods = function (models) {
    var venueModel = models.venue,
        eventModel = models.event,
        methods = {
            getById: function (req, res, next, id) {
                venueModel.load(id, function (err, venue) {
                    if (err) return next(err);
                    if (!venue) return next(new Error('Failed to load venue ' + id));
                    req.venue = venue;
                    next();
                });
            },
            show: function (req, res) {
                var venue = req.venue;
                eventModel.loadLinkedToVenue(venue._id, function (err, events) {
                    if (err) {
                        res.render('error', {
                            status: 500
                        });
                    };
                    venue.events = events;
                    res.jsonp(venue);
                })

            },
            create: function (req, res) {
                var venue = new venueModel(req.body);
                //venue.user = req.user || {name: "vygis", username: "vygintas"}; //TODO find out where the user is coming from
                venue.save(function (err) {
                    if (err) {
                        res.render('error', {
                            status: 500
                        });
                    } else {
                        res.jsonp(venue);
                    }
                });
            },
            update: function (req, res) {
                var venue = req.venue;

                venue = _.extend(venue, req.body);

                venue.save(function (err) {
                    if (err) {
                        res.render('error', {
                            status: 500
                        });
                    } else {
                        res.jsonp(venue);
                    }
                });
            },
            delete: function (req, res) {
                var venue = req.venue;

                venue.remove(function (err) {
                    if (err) {
                        res.render('error', {
                            status: 500
                        });
                    } else {
                        res.jsonp(venue);
                    }
                });
            },
            all: function (req, res) {
                venueModel.find().sort('-created').populate('creator', 'name username').exec(function (err, venues) {
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
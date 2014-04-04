var createMethods = function (models) {
    var eventModel = models.event,
        methods = {
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
                //event.user = req.user || {name: "vygis", username: "vygintas"}; //TODO find out where the user is coming from
                var venueId = "533da7411a43f180028f0c94"; //saatchi
                event.venues.push(venueId);
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

                event.remove(function(err) {
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
            }
        };
    return methods;
};



exports.addRoutes = function (app, models) {
    var methods = createMethods(models);
    app.get('/rest/events', methods.all);
    app.post('/rest/events', methods.create);
    app.get('/rest/events/:eventId', methods.show);
    app.put('/rest/events/:eventId', methods.update);
    app.del('/rest/events/:eventId', methods.delete); //TODO add authorisation middleware
    app.param('eventId', methods.getById);
};
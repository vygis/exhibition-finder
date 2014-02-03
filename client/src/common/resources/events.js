angular.module('resources.events', ['mongolabResource']);
angular.module('resources.events').factory('Events', ['mongolabResource', function ($mongolabResource) {

    var Events = $mongolabResource('events');

    Events.forUser = function(userId, successcb, errorcb) {
        //TODO: get events for this user only (!)
        return Events.query({}, successcb, errorcb);
    };

    return Events;
}]);
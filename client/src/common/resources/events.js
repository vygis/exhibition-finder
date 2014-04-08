angular.module('resources.events', ['mongooseResource']);
angular.module('resources.events').factory('EventResource', ['mongooseResource', function (mongooseResource) {

    var Events = mongooseResource('events');

    return Events;
}]);
angular.module('resources.venues', ['mongolabResource']);
angular.module('resources.venues').factory('Venues', ['mongolabResource', function ($mongolabResource) {

    var Venues = $mongolabResource('venues');



    return Venues;
}]);
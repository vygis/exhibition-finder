angular.module('resources.venues', ['mongooseResource']);
angular.module('resources.venues').factory('Venues', ['mongooseResource', function ($mongooseResource) {

    var Venues = $mongooseResource('venues');



    return Venues;
}]);
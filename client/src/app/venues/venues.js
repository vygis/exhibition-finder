angular.module('venues', ['resources.venues', 'security.authorization'])

    .config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
        $routeProvider.when('/venues', {
            templateUrl:'venue/venues-list.tpl.html',
            controller:'VenuesViewCtrl',
            resolve:{
                venues:['Venues', function (Venues) {
                    return Venues.all();
                }],
                authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
            }
        });
    }])

    .controller('VenuesViewCtrl', ['$scope', '$location', 'venues', 'security', function ($scope, $location, venues, security) {
        $scope.venues = venues;

        $scope.viewVenue = function (venue) {
            $location.path('/admin/venues/'+venue.$id());
        };
    }]);

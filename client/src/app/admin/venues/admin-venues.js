angular.module('admin-venues', [
        'resources.venues',
        'resources.users',
        'services.crud',
        'security.authorization'
    ])

    .config(['crudRouteProvider', 'securityAuthorizationProvider', function (crudRouteProvider, securityAuthorizationProvider) {

        var getAllUsers = ['Venues', 'Users', '$route', function(Venues, Users, $route){
            return Users.all();
        }];

        crudRouteProvider.routesFor('Venues', 'admin')
            .whenList({
                venues: ['Venues', function(Venues) { return Venues.all(); }],
                adminUser: securityAuthorizationProvider.requireAdminUser
            })
            .whenNew({
                venue: ['Venues', function(Venues) { return new Venues(); }],
                users: getAllUsers,
                adminUser: securityAuthorizationProvider.requireAdminUser
            })
            .whenEdit({
                venue: ['Venues', 'Users', '$route', function(Venues, Users, $route) { return Venues.getById($route.current.params.itemId); }],
                users: getAllUsers,
                adminUser: securityAuthorizationProvider.requireAdminUser
            });
    }])

    .controller('VenuesListCtrl', ['$scope', 'crudListMethods', 'venues', function($scope, crudListMethods, venues) {
        $scope.venues = venues;

        angular.extend($scope, crudListMethods('/admin/venues'));
    }])

    .controller('VenuesEditCtrl', ['$scope', '$location', 'i18nNotifications', 'users', 'venue', function($scope, $location, i18nNotifications, users, venue) {

        $scope.venue = venue;
        $scope.users = users;

        $scope.onSave = function(venue) {
            i18nNotifications.pushForNextRoute('crud.venue.save.success', 'success', {id : venue.$id()});
            $location.path('/admin/venues');
        };

        $scope.onError = function() {
            i18nNotifications.pushForCurrentRoute('crud.venue.save.error', 'error');
        };

    }]);
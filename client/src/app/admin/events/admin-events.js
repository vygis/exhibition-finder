angular.module('admin-events', [
        'resources.events',
        'resources.users',
        'services.crud',
        'security.authorization'
    ])

    .config(['crudRouteProvider', 'securityAuthorizationProvider', function (crudRouteProvider, securityAuthorizationProvider) {

        var getAllUsers = ['Events', 'Users', '$route', function(Events, Users, $route){
            return Users.all();
        }];

        crudRouteProvider.routesFor('Events', 'admin')
            .whenList({
                events: ['Events', function(Events) { return Events.all(); }],
                adminUser: securityAuthorizationProvider.requireAdminUser
            })
            .whenNew({
                event: ['Events', function(Events) { return new Events(); }],
                users: getAllUsers,
                adminUser: securityAuthorizationProvider.requireAdminUser
            })
            .whenEdit({
                event: ['Events', 'Users', '$route', function(Events, Users, $route) { return Events.getById($route.current.params.itemId); }],
                users: getAllUsers,
                adminUser: securityAuthorizationProvider.requireAdminUser
            });
    }])

    .controller('EventsListCtrl', ['$scope', 'crudListMethods', 'events', function($scope, crudListMethods, events) {
        $scope.events = events;

        angular.extend($scope, crudListMethods('/admin/events'));
    }])

    .controller('EventsEditCtrl', ['$scope', '$location', 'i18nNotifications', 'users', 'event', function($scope, $location, i18nNotifications, users, event) {

        $scope.event = event;
        $scope.users = users;

        $scope.onSave = function(event) {
            i18nNotifications.pushForNextRoute('crud.event.save.success', 'success', {id : event.$id()});
            $location.path('/admin/events');
        };

        $scope.onError = function() {
            i18nNotifications.pushForCurrentRoute('crud.event.save.error', 'error');
        };

    }]);
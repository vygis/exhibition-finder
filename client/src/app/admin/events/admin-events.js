angular.module('admin-events', [
        'resources.events',
        'resources.users',
        'services.crud',
        'security.authorization'
    ])

    .config(['crudRouteProvider', 'securityAuthorizationProvider', function (crudRouteProvider, securityAuthorizationProvider) {

        var getAllUsers = ['EventResource', 'Users', '$route', function(EventResource, Users, $route){
            return Users.all();
        }];

        crudRouteProvider.routesFor('Events', 'admin')
            .whenList({
                events: ['EventResource', function(EventResource) { return EventResource.all(); }],
                adminUser: securityAuthorizationProvider.requireAdminUser
            })
            .whenNew({
                event: ['EventResource', function(EventResource) { return new EventResource(); }],
                users: getAllUsers,
                adminUser: securityAuthorizationProvider.requireAdminUser
            })
            .whenEdit({
                event: ['EventResource', 'Users', '$route', function(EventResource, Users, $route) { return EventResource.getById($route.current.params.itemId); }],
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
angular.module('directives.crud.linkedItems', [])

    .directive('crudLinkedItems', function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                label: "@",
                parent: "=",
                children: "="
            },
            replace: true,
            template: function ($scope, attrs) {
                return '<div class="form-group" ng-cloak>' +
                    '<label>{{label}}</label>' +
                    '<div class="list-group">' +
                    '<a href="#" class="list-group-item" ng-repeat="child in children">{{child.name}}</a>' +
                    '<div class="list-group-item">' +
                    '<button type="button" class="btn btn-xs btn-default">Add</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
            }

        };
    });
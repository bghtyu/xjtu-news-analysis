/**
 * Created by walter on 15-4-16.
 */

angular.module('newsApp').config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.
        when('/', {
            templateUrl: '/pages/newsList.html',
            controller: 'newsListCtrl'
        }).
        when('/content', {
            templateUrl: '/pages/newsContent.html',
            controller: 'newsContentCtrl'
        }).
        otherwise({
            redirectTo: '/'
        })
});

var app = angular.module('EasyTicket', ['ngRoute', 'ngMaterial', 'ngMessages']);
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/Home'
        })
        .when('/Home', {
            templateUrl: '/Home/Information',
            controller: 'HomeController',
            title: 'Travel Information'
        })
        .when('/Error', {
            templateUrl: '/Error/Index',
            controller: 'ErrorController',
            title: 'Page not found'
        })
        .otherwise({
            redirectTo: '/Error'
        });
    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });
}]);
app.run(['$location', '$rootScope', function ($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        if (current.hasOwnProperty('$$route')) {
            $rootScope.title = current.$$route.title;
        }
    });
}]);
app.controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log, $mdDialog, $mdToast) {
    $scope.PageLoaded = false;
    $scope.User = "Delegate";
    $scope.$on('$viewContentLoaded', function () {
        $scope.PageLoaded = true;
    });
    $scope.$watch('isOpen', function (isOpen) {
        if (isOpen) {
            $timeout(function () {
                $scope.tooltipVisible = $scope.isOpen;
            }, 600);
        } else {
            $scope.tooltipVisible = $scope.isOpen;
        }
    });
    $scope.CloseMenu = function () {
        $timeout(function () {
            $scope.isOpen = false;
        }, 500);
    }
    $scope.isOpen = false;
    $scope.customFullscreen = true;
    //Profile
    $scope.showAdvanced = function (ev) {
        $mdDialog.show({
            locals: { dataToPass: ev.to_do },
            controller: DialogController,
            templateUrl: 'Home/Profile',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
    };
    function DialogController($scope, $mdDialog, dataToPass) {
        $scope.DataRecieved = dataToPass;

        $scope.showPrompt = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt({ multiple: true })
                .title(ev.title)
                .textContent(ev.textContent)
                .placeholder(ev.placeholder)
                .ariaLabel(ev.ariaLabel)
                .initialValue(ev.initialValue)
                .targetEvent(ev)
                .required(true)
                .openFrom({
                    top: -50,
                    width: 30,
                    height: 80
                })
                .closeTo({
                    left: 1500
                })
                .ok('Sure!')
                .cancel('Not now');

            $mdDialog.show(confirm).then(function (result) {
                $scope.status = 'Wow! You donated ' + result + '.';
            }, function () {
                $scope.status = 'You didn\'t donate anything';
            }).then(function () {
                $scope.showAlert({ Type: 'Donation Status', Description: $scope.status });
            });
        };

        $scope.showAlert = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show(
                $mdDialog.alert({ multiple: true })
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title(ev.Type)
                    .textContent(ev.Description)
                    .ariaLabel(ev.Type)
                    .ok('Got it!')
                    .targetEvent(ev)
                    .openFrom({
                        top: -50,
                        width: 30,
                        height: 80
                    })
                    .closeTo({
                        left: 1500
                    })
            );
        };

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    }

    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.isOpenRight = function () {
        return $mdSidenav('right').isOpen();
    };

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
        var timer;

        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function () {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
        return debounce(function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    $log.debug("toggle " + navID + " is done");
                });
        }, 200);
    }

    function buildToggler(navID) {
        return function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    $log.debug("toggle " + navID + " is done");
                });
        };
    }
})
    .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });

        };
    });
app.controller('ErrorController', function ($scope) {
    $scope.ErrorCode = 404;
});
        
angular.module("TableApp", ["ngResource", "ngAnimate", "ui.bootstrap"])
    .controller("TableController", ["$scope", "$resource", "$uibModal", function ($scope, $resource, $uibModal) {
        $resource("./persons.json").get(function (data) {
            $scope.persons = data.persons;
            $scope.keysOfPerson = _.keys($scope.persons[0]);
            $scope.keyRusNames = ["ID", "Фамилия", "Имя", "Отчество", "Должность", "Телефон", "Дата найма"];
        });
        $resource("./positionsOfEmployees.json").get(function (data) {
            $scope.positions = data.positions;
        });
        $scope.showModal = false;
        $scope.sortType = 'id';
        $scope.sortReverse = false;
        $scope.editPerson = function (id) {
            $scope.bufPerson = angular.copy(_.find($scope.persons, function (obj) {
                return obj.id === id
            }));
            $scope.isEditing = true;
            $scope.ModalTitle = 'Редактирование записи';
            $scope.showModal = true;
            $scope.open("edit");
        };
        $scope.savePerson = function (id) {
            if (id !== undefined) {
                $scope.persons = _.map($scope.persons, function (obj) {
                    return obj.id === id ? $scope.bufPerson : obj;
                })
            }
            else {
                $scope.bufPerson.id = _.max(_.pluck($scope.persons, "id")) + 1;
                $scope.persons.push($scope.bufPerson);
            }
        };
        $scope.addPerson = function () {
            $scope.ModalTitle = 'Добавление записи';
            $scope.isEditing = false;
            $scope.bufPerson = {};
            $scope.showModal = true;
            $scope.open();
        };
        $scope.delPerson = function (id) {
            $scope.persons = _.reject($scope.persons, function (obj) {
                return obj.id === id;
            });
        };
        $scope.sortBy = function (attr) {
            if ($scope.sortType === attr) $scope.sortReverse = !$scope.sortReverse;
            else {
                $scope.sortType = attr;
                $scope.sortReverse = false;
            }
        };
        $scope.open = function (type) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modalTemplate.html',
                controller: 'ModalCtrl',
                resolve: {
                    modalScope: function () {
                        return {
                            bufPerson: $scope.bufPerson,
                            type: type,
                            positions: $scope.positions
                        }
                    }
                }
            });
            modalInstance.result.then(function (action) {
                action === "delete" ? $scope.delPerson($scope.bufPerson.id) : $scope.savePerson($scope.bufPerson.id);
            });
        };
        $scope.myCallBack = function(a) {
            alert(a);
        }
    }])
    .controller('ModalCtrl', function ($scope, $uibModalInstance, modalScope) {
        $scope.bufPerson = modalScope.bufPerson;
        $scope.positions = modalScope.positions;
        modalScope.type === "edit" ? $scope.isEditing = true : false;
        $scope.modalTitle = ($scope.isEditing) ? "Изменить информацию" : "Добавить сотрудника";
        $scope.action = function (action) {
            (action !== "cancel") ? $uibModalInstance.close(action) : $uibModalInstance.dismiss();
        };
        $scope.open = function () {
            $scope.popup.opened = true;
        };
        $scope.popup = {
            opened: false
        };
    })
    .directive('checkPosition', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.checkPosition = function (modelValue, viewValue) {
                    return _.indexOf(scope.positions, viewValue) !== -1;
                };
            }
        };
    })
    .directive('telephone', function () {
        var PHONE_REGEXP = /^\+?[0-9]?[0-9,\-]+$/;
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.telephone = function (modelValue, viewValue) {
                    return PHONE_REGEXP.test(viewValue);
                };
            }
        };
    })
    .directive('formEnterFocus', function () {
        return {
            require: '^form',
            link: function (scope, elm, attrs, ctrl) {
                var inputs = elm.find('input');
                var button = elm.find('button')[0];
                inputs.bind("keypress", function (e) {
                    if (e.code === "Enter") {
                        var el = _.indexOf(inputs, this);
                        if (ctrl[this.name].$valid) {
                            if (inputs[el + 1]) {
                                var nextInput = inputs[el + 1];
                                if (nextInput.attributes['uib-datepicker-popup']) {
                                    angular.element(nextInput)
                                        .parent()
                                        .find("a")
                                        .triggerHandler("click");
                                }
                                else nextInput.focus();
                            }
                            else button.focus();
                        }
                    }
                });
            }
        };
    })
    .directive('myDirective', function() {
        return {
            restrict: 'E',
            scope: {
                list: '=',
                callback: '&'
            },
            replace: true,
            transclude: true,
            link: function(scope, element, attrs, controllers) {

            },
            template: '<ul class="list-group"><li ng-repeat="item in list" class="list-group-item" ng-click="callback()" ng-transclude></li></ul>'
        };
    })
    .directive('myDirectiveContent', function(){
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            transclude: true,
            template: '<div ng-transclude></div>'
        }
    });

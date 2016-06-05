angular.module("TableApp", ["ngResource", "ngAnimate", "ui.bootstrap"])
    .controller("TableController", ["$scope", "$resource", "$uibModal", function ($scope, $resource, $uibModal) {
        var data1 = $resource("./persons.json").get(function () {
            $scope.persons = data1.persons;
        });
        var data2 = $resource("./positionsOfEmployees.json").get(function () {
            $scope.positions = data2.positions;
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
            modalInstance.result.then(function (person) {
                    $scope.savePerson(person.id);
                },
                function (id) {
                    id !== undefined ? $scope.delPerson(id) : false;
                });
        };
    }])
    .controller('ModalCtrl', function ($scope, $uibModalInstance, modalScope) {
        $scope.bufPerson = modalScope.bufPerson;
        $scope.positions = modalScope.positions;
        modalScope.type === "edit" ? $scope.isEditing = true : false;
        $scope.modalTitle = ($scope.isEditing) ? "Изменить информацию" : "Добавить сотрудника"
        $scope.save = function () {
            $uibModalInstance.close($scope.bufPerson);
        };
        $scope.close = function () {
            $uibModalInstance.dismiss();
        };
        $scope.del = function () {
            $uibModalInstance.dismiss(bufPerson.id);
        };
        $scope.open = function () {
            $scope.popup.opened = true;
        };
        $scope.popup = {
            opened: false
        };
    })
    .directive('position', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.position = function (modelValue, viewValue) {
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
    });

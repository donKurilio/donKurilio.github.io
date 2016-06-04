angular.module("TableApp", ["ngResource", "ngAnimate", "ui.bootstrap"])
    .controller("TableController", ["$scope", "$resource", "$uibModal", function ($scope, $resource, $uibModal) {
        $scope.showModal = false;
        $scope.sortType = 'id';
        $scope.sortReverse = false;
        var data = $resource("./persons.json").get(function () {
            $scope.persons = data.persons;
        });
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
                    bufPerson: function () {
                        return $scope.bufPerson;
                    },
                    modalTitle: function () {
                        return "Изменить пользователя";
                    },
                    type: function () {
                        return type;
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
    }]);
angular.module("TableApp")
    .controller('ModalCtrl', function ($scope, $uibModalInstance, bufPerson, modalTitle, type) {
        $scope.bufPerson = bufPerson;
        $scope.modalTitle = modalTitle;
        type === "edit" ? $scope.isEditing = true : false;
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
    });
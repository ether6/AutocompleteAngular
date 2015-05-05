(function () {
    'use strict';
    var directiveId = 'autocomplete';
    angular.module('app').directive(directiveId, [autocomplete]);

    function autocomplete() {
        return {
            restrict:'A',
            scope: false,
            transclude: true,
            template:   '<p class="input-group">' +
                            '<input class="form-control" type="text" placeholder="Start typing. Press enter to search. Enter again to select" ng-keydown="checkKeyDown($event)" ng-keyup="checkKeyUp($event)" class="form-control" ng-model="searchText" ng-change="search()"/>' +
                            '<span class="input-group-btn">' +
                                '<button type="button" class="btn btn-default btn-input-group" ng-click="lookup()">' +
                                    '<i class="glyphicon glyphicon-search"></i>' +
                                '</button>' +
                            '</span>' +
                            '<ul id="suggestions" class="suggestions-list">' +
                                '<li ng-repeat="suggestion in suggestions" class="blockSpan" ng-click="setModelValue($index)" ng-mouseover="$parent.selectedIndex=$index" ng-class="{active : selectedIndex===$index}">{{suggestion}}</li>' +
                            '</ul>'+
                        '</p>',
            link: function(scope,elem,attrs){

                var temp_data = [];

                scope.suggestions=[];

                scope.selectedTags=[];

                scope.selectedIndex=-1;

                scope.removeTag=function(index){
                    scope.selectedTags.splice(index,1);
                }

                scope.search=function(datasource, searchText){
                    // To be sourced and filtered by webservice ($http) -- remove these lines:
                    var temp_data = [
                        'Pear',
                        'Strawberry',
                        'Banana',
                        'Peach',
                        'Kiwi',
                        'Orange',
                        'Watermellon',
                        'Apple',
                        'Grapefruit',
                    ];
                    var suggestions=[];
                    for (var i = 0; i < temp_data.length; i++) {
                        if(temp_data[i].indexOf(searchText)>-1){
                            suggestions.push(temp_data[i]);
                        }
                    };
                    // end remove these lines
                    return suggestions;
                };

                scope.lookup = function() {
                    scope.suggestions = scope.search(attrs.datasource, scope.searchText);
                    if(scope.searchText.length > 0 && scope.suggestions.indexOf(scope.searchText) === -1)
                        scope.suggestions.push(scope.searchText);
                    scope.selectedIndex=-1;
                };

                scope.setModelValue=function(index){
                    scope[attrs.targetmodel] = scope.suggestions[index];
                    scope.searchText='';
                    scope.suggestions=[];
                    scope.selectedIndex=-1;
                }

                scope.checkKeyDown=function(event){
                    if(event.keyCode === 13)
                        event.preventDefault();
                }

                scope.checkKeyUp=function(event){
                    if(event.keyCode===40){
                        event.preventDefault();
                        if(scope.selectedIndex+1 !== scope.suggestions.length){
                            scope.selectedIndex++;
                        }
                    }
                    else if(event.keyCode===38){
                        event.preventDefault();
                        if(scope.selectedIndex-1 !== -1){
                            scope.selectedIndex--;
                        }
                    }
                    else if(event.keyCode===13){
                        event.preventDefault();
                        if(scope.selectedIndex !== -1)
                            scope.setModelValue(scope.selectedIndex);
                        else
                            scope.lookup();
                    }
                }

                scope.$watch('selectedIndex',function(val){
                    if(val!==-1) {
                        scope.searchText = scope.suggestions[scope.selectedIndex];
                    }
                });
            }
        }
    }
})();

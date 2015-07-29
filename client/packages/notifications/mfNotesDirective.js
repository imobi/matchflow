angular.module('matchflow').directive(
    'mfNotes', ['notesService',function(notesService) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div></div>',
            link: function(scope,elem,attr) {
                scope.notes = [];
                var listHtml = '<ul class="mf-notes">';
                for (var l = 0; l < scope.notes.length; l++) {
                    var note = scope.notes[l];
                    listHtml += '<li id="'+note.id+'" class="'+note.type+'">'+note.name+'</li>';
                }
                listHtml += '</ul>';
                elem.html(listHtml);
            }
        };
    }
]);
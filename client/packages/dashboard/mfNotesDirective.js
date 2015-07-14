angular.module('matchflow').directive(
    'mfNotes', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                notes: '=noteData'
            },
            template: '<div></div>',
            link: function(scope,elem,attr) {
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
);
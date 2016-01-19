angular.module('matchflow').directive('mfTagTree', ['$compile','modalDialogService',function($compile,modalDialogService) {
	return {
		scope: {
			tagData : '=',
            activeDialogKey : '='
		},
		template: '<div class="mf-tag-tree-container">'+
                    '<div class="tree-overflow-content">'+
                        '<ul class="sg-tree-root nav nav-list">'+
                        '</ul>'+
                    '</div>'+
				  '</div>',
		replace: true,
		restrict: 'E',
		link: function(scope, element, attrs) {
            scope.unhighlight = function() {
                angular.element('.mf-highlight').removeClass('mf-highlight');
            };
            scope.highlight = function(selector) {
                scope.unhighlight();
                angular.element(selector).addClass('mf-highlight');
            };
            scope.removeTag = function(id) {
                // use the service to remove this tag
                var idArr = id.split('_');
                // 'group_'+groupName+'_event_' + index + '_' + time,
                var tagIndex = idArr[idArr.length-2]; // second last index for the tags index in the tag array
                var deleteDialogData = {
                    'data' : {
                        name : id,
                        tagIndex : Number(tagIndex)
                    },
                    'delete' : function(data){
                        console.log('delete: ',data.tagIndex);
                        scope.tagData.splice(data.tagIndex,1);
                        scope.activeDialogKey = '';
                    },
                    'open' : function(){
                        scope.activeDialogKey = id;
                    },
                    'cancel' : function(){
                        scope.activeDialogKey = '';
                    }
                };
                modalDialogService.open('deleteTagConfirmation',id,deleteDialogData);
            };
            var treeBuilder = function(treeElem,lvl) {
                var bgColor = treeElem.colors !== undefined && treeElem.colors.bg !== undefined ? treeElem.colors.bg : 'white';
                var fgColor = treeElem.colors !== undefined && treeElem.colors.fg !== undefined ? treeElem.colors.fg : 'black';
                var selectorClass = treeElem.selector;
                if (treeElem.children !== undefined) {
                    var treeHtml = '<li class="lvl-'+lvl+'">';
                    treeHtml += '<label ng-mouseenter="highlight(\''+selectorClass+'\');" ng-mouseleave="unhighlight();" class="tree-toggler nav-header" style="color:'+fgColor+';background-color:'+bgColor+';">'+treeElem.name+'</label>';
                    treeHtml += '<ul class="nav nav-list tree">';
                    for (var t = 0; t < treeElem.children.length; t++) {
                        var treeTag = treeElem.children[t];
                        treeHtml += treeBuilder(treeTag,lvl+1);
                    }
                    treeHtml += '</ul>';
                    treeHtml += '</li>';
                    return treeHtml;
                } else {
                    return '<li class="lvl-'+lvl+'" style="background-color:'+bgColor+';" >'+
                               '<div style="width:100%; height: 30px; line-height: 30px;">'+
                                   '<a href="#" ng-mouseenter="highlight(\''+selectorClass+'\');" ng-mouseleave="unhighlight();" style="color:'+fgColor+'; display:inline-block; float:left; margin-left:10px;">'+
                                       treeElem.name+
                                   '</a>'+
                                   '<a ng-click="removeTag(\''+treeElem.id+'\');" style="color:'+fgColor+'; display:inline-block; float:right; margin-right:10px;">'+
                                       '<span class="glyphicon glyphicon-trash"></span>'+
                                   '</a>'+
                               '</div>'+
                           '</li>';
                }
            };
            // Returns the tags grouped by category in arrays
            scope.$watch(
                'tagData',
                function(newTags,oldTags){
                    if (newTags !== undefined) {
                        // This watch rebuilds the tag tree after each new tag add
                        // TODO this can be made MUCH more efficient
                        var newGroupedTagsArray = [];
                        var groupingIndexMap = {};
                        
                        // Grouping Order: category > name > timestamp
                        for (var t = 0; t < newTags.length; t++) {
                            var currentTag = newTags[t];
                            // index currently doesnt exist, so create new object
                            if (groupingIndexMap[currentTag.category] === undefined) {
                                // add the category and store its index
                                groupingIndexMap[currentTag.category] = { index:newGroupedTagsArray.length };
                                newGroupedTagsArray[newGroupedTagsArray.length] = {
                                    id: 'category_'+currentTag.id,
                                    name: currentTag.category, // group level
                                    selector: '.mf-'+currentTag.category+'-c',
                                    colors: currentTag.colors,
                                    children:[ // event level
                                        {
                                            id: 'event_'+currentTag.id,
                                            name: currentTag.name,
                                            selector: '.mf-'+currentTag.category+'-c.mf-'+currentTag.name+'-n',
                                            colors: currentTag.colors,
                                            children: [ // timestamp level
                                                {
                                                    id: currentTag.id,
                                                    name: currentTag.time+'s',//'[-'+currentTag.before+'ms] '+currentTag.time+'ms [+'+currentTag.after+'ms]',
                                                    selector: '.mf-'+currentTag.category+'-c.mf-'+currentTag.time+'-t',
                                                    colors: currentTag.colors
                                                }
                                            ]
                                        }
                                    ]
                                };
                            } else {
                                // find the index for the child
                                var children = newGroupedTagsArray[
                                        groupingIndexMap[
                                            currentTag.category
                                        ].index
                                    ].children;
                                var found = false;
                                var index = 0;
                                for (index = 0; index < children.length && !found; index++) {
                                    if (children[index].name === currentTag.name) {
                                        found = true;
                                        index--;
                                    }
                                }
                                if (found) {
                                    // we found a tag with the same name, so we just add this tags timestamp under it
                                    children[index].children[
                                        children[index].children.length
                                    ] = {
                                        id: currentTag.id,
                                        name: currentTag.time+'s',//'[-'+currentTag.before+'ms] '+currentTag.time+'ms [+'+currentTag.after+'ms]',
                                        selector: '.mf-'+currentTag.category+'-c.mf-'+currentTag.time+'-t',
                                        colors: currentTag.colors
                                    };
                                } else {
                                    // otherwise its a new tag instance
                                    newGroupedTagsArray[
                                        groupingIndexMap[
                                            currentTag.category
                                        ].index
                                    ].children[
                                        newGroupedTagsArray[
                                            groupingIndexMap[
                                                currentTag.category
                                            ].index
                                        ].children.length
                                    ] = {
                                        id: 'event_'+currentTag.id,
                                        name: currentTag.name,
                                        selector: '.mf-'+currentTag.category+'-c.mf-'+currentTag.name+'-n',
                                        colors: currentTag.colors,
                                        children: [ // timestamp level
                                            {
                                                id: currentTag.id,
                                                name: currentTag.time+'s',//'[-'+currentTag.before+'ms] '+currentTag.time+'ms [+'+currentTag.after+'ms]',
                                                selector: '.mf-'+currentTag.category+'-c.mf-'+currentTag.time+'-t',
                                                colors: currentTag.colors
                                            }
                                        ]
                                    };
                                }
                            }
                        }
                        
                        element.find('.sg-tree-root').html(
                            treeBuilder(
                                {
                                    name: 'Tag Tree',
                                    children: newGroupedTagsArray
                                },
                                0
                            )
                        );
                        $compile(element.find('.sg-tree-root'))(scope);
                        element.find('label.tree-toggler').click(function () {
                            element.find(this).parent().children('ul.tree').toggle(300);
                        });
                    }
                },
                true
            );
		}            
	};
}]);

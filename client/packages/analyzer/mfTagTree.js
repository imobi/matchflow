angular.module('matchflow').directive('mfTagTree', function($compile) {
	return {
		scope: {
			tagData : '=tagData'
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
            scope.$watch(
                'tagData',
                function(newTags,oldTags){
                    if (newTags !== undefined) {
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
                                //<li class="divider"></li>
                                return treeHtml;
                            } else {
                                return '<li class="lvl-'+lvl+'" style="background-color:'+bgColor+';" ><a href="#" ng-mouseenter="highlight(\''+selectorClass+'\');" ng-mouseleave="unhighlight();" style="color:'+fgColor+';">'+treeElem.name+'</a></li>';
                            }
                        };
                        element.find('.sg-tree-root').html(
                            treeBuilder(
                                {
                                    name: 'Tag Tree',
                                    children: newTags
                                },
                                0
                            )
                        );
                        $compile(element.find('.sg-tree-root'))(scope);
                        element.find('label.tree-toggler').click(function () {
                            element.find(this).parent().children('ul.tree').toggle(300);
                        });
                        // TODO on hover of a node, highlight all corresponding items in the taglines, use CSS selector
                    }
                },
                true
            );
		}            
	};
});
/*
$(document).ready(function () {
	$('label.tree-toggler').click(function () {
		$(this).parent().children('ul.tree').toggle(300);
	});
});
 * 
<div class="well" style="width:300px; padding: 8px 0;">
    <div style="overflow-y: scroll; overflow-x: hidden; height: 500px;">
        <ul class="nav nav-list">
            <li><label class="tree-toggler nav-header">Header 1</label>
                <ul class="nav nav-list tree">
                    <li><a href="#">Link</a></li>
                    <li><a href="#">Link</a></li>
                    <li><label class="tree-toggler nav-header">Header 1.1</label>
                        <ul class="nav nav-list tree">
                            <li><a href="#">Link</a></li>
                            <li><a href="#">Link</a></li>
                            <li><label class="tree-toggler nav-header">Header 1.1.1</label>
                                <ul class="nav nav-list tree">
                                    <li><a href="#">Link</a></li>
                                    <li><a href="#">Link</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="divider"></li>
            <li><label class="tree-toggler nav-header">Header 2</label>
                <ul class="nav nav-list tree">
                    <li><a href="#">Link</a></li>
                    <li><a href="#">Link</a></li>
                    <li><label class="tree-toggler nav-header">Header 2.1</label>
                        <ul class="nav nav-list tree">
                            <li><a href="#">Link</a></li>
                            <li><a href="#">Link</a></li>
                            <li><label class="tree-toggler nav-header">Header 2.1.1</label>
                                <ul class="nav nav-list tree">
                                    <li><a href="#">Link</a></li>
                                    <li><a href="#">Link</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li><label class="tree-toggler nav-header">Header 2.2</label>
                        <ul class="nav nav-list tree">
                            <li><a href="#">Link</a></li>
                            <li><a href="#">Link</a></li>
                            <li><label class="tree-toggler nav-header">Header 2.2.1</label>
                                <ul class="nav nav-list tree">
                                    <li><a href="#">Link</a></li>
                                    <li><a href="#">Link</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</div>
*/
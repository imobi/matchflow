angular.module('matchflow').factory('managerService',['$meteor','utilsService','userService','tabService',function($meteor,utilsService,userService,tabService){
    // manager service
    // these will all split into their own services in future
    return {
        getEventsManager : function() { 
            return {
                eventGroupToAdd: {
                    id: '',
                    name: '',
                    bgColor: 'green',
                    txtColor: 'white',
                    eventToAdd: { 
                        name: '',
                        before: 500,
                        after: 500
                    },
                    eventList : []
                },
                eventGroupList: [],
                eventGroupMap: {},
                setEventGroups : function(currentEventGroupList) {
                    // load the eventGroups from the list parameter (adds them to the group as well)
                    this.eventGroupList = currentEventGroupList;
                    // and add them to the map
                    this.eventGroupMap = {};
                    for (var e = 0; e < this.eventGroupList.length; e++) {
                        var eventGroup = this.eventGroupList[e];
                        this.eventGroupMap[eventGroup.id] = eventGroup;
                    }
                },
                getEventGroups : function() {
                    return this.eventGroupList;
                },
                addEventGroup: function () {
                    if (this.eventGroupToAdd && this.eventGroupToAdd.name && 
                        this.eventGroupToAdd.name.length > 0) {
                        this.eventGroupToAdd.id = utilsService.replaceAll(this.eventGroupToAdd.name,' ','_');
                        this.eventGroupList[this.eventGroupList.length] = this.eventGroupToAdd;
                        this.eventGroupMap[this.eventGroupToAdd.id] = this.eventGroupToAdd;
                        this.clearInput();
                    }
                },
                clearInput: function() {
                    this.eventGroupToAdd = {
                        id: '',
                        name: '',
                        bgColor: 'green',
                        txtColor: 'white',
                        eventToAdd: { 
                            name: '',
                            before: 500,
                            after: 500
                        },
                        eventList : []
                    };
                },
                removeEventGroup: function (index) {
                    var eventGroup = this.eventGroupList[index];
                    this.eventGroupMap[eventGroup.id] = undefined;
                    eventGroup = undefined;
                    this.eventGroupList.splice(index, 1);
                },
                addEventToGroup : function(id) {
                    if (this.eventGroupMap[id] !== undefined) {
                        this.eventGroupMap[id].eventList[this.eventGroupMap[id].eventList.length] = this.eventGroupMap[id].eventToAdd;
                        this.clearEventInput(id);
                    }
                },
                clearEventInput: function(id) {
                    if (this.eventGroupMap[id] !== undefined) {
                        this.eventGroupMap[id].eventToAdd = { 
                            name: '',
                            before: 500,
                            after: 500
                        };
                    }
                },
                removeEventFromGroup : function(id,index) {
                    if (this.eventGroupMap[id] !== undefined) {
                        this.eventGroupMap[id].eventList.splice(index, 1);
                    }
                }
            }; 
        },
        profileManager : {},
        leagueManager : {},
        teamManager : {},
        getTabFilterManager : function() {
            return {
                filterVisibility : {
                    'not' : true,
                    'and' : true,
                    'or' : true,
                    'collection' : true,
                    'field' : true,
                    'public' : true
                },
                newTabData : {
                    name: '',
                    filtersStr: 'public',
                    filterBuilderValue: '',
                    filters: [
                        /* TODO build a filter builder
                         { 
                            value: 'abc',
                            type: 'OR'/'AND',
                            not: true/false
                         } or
                         {
                            type: 'BRACKETS',
                            value: [...]
                         }
                         */
                    ]
                },
                addTabFilter : function() {
                    // access the newTabData object and add to the user
                    tabService.addTab(this.newTabData.name,this.newTabData.filtersStr);
                },
                removeTabFilter : function(id) {
                    // delete the specified tab off the user
                    tabService.removeTab(id);
                }
            };
        }
    };
}]);
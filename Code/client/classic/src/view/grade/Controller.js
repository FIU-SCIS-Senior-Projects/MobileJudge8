/**
 * Created by rodolfo on 1/95/16.
 */
Ext.define('MobileJudge.view.grade.Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.grade',

	windows: {},
	model: null,
	deleteRecord: {},

	init: function(view) {
		this.model = view.getViewModel();
        var data = null;
        var text = 'Accept';
        var dataArray = null;
	},
    
    returnData: function(){
            return this.dataArray;
    },
    
    saveIndependentGrade: function(data) {
        Ext.Ajax.request({
                url: '/api/views_table/saveData',
                success: function(response){
                    console.log("GOT INTO THE CALLBACK");
                },
                failure: this.updateError,
                jsonData :data,
                disableCaching:true,
                method:'POST'		   
        }); 
    },
    
    getData: function(data){
        console.log("Requesting data for the selected student");
            Ext.Ajax.request({
                url: '/api/views_table/judges',
                success: function(response){
                    var data = JSON.parse(response.responseText)
                    data.judges.forEach(function(judge){
                        data.students.forEach(function(student){
                            if(student.judgeId == judge.id)
                                student.judgeName = judge.fullName;
                        })
                    })
                    data.students.forEach(function(student){
                        var tempAverage = 1;
                            data.grades.forEach(function(grade){
                               if(student.judgeName == grade.judge && student.fullName == grade.student && student.project == grade.projectName)
                                {
                                    student.gradeAverage = student.gradeAverage + grade.grade;
                                    tempAverage ++;
                                }    
                            })
                            student.gradeAverage = student.gradeAverage / tempAverage;
                        })
                    
                    return data;
                    Ext.getStore('mockData').data = data.students;
                    Ext.getStore('mockData').reload();
                },
                failure: this.updateError,
                jsonData :data,
                disableCaching:true,
                method:'POST'		   
        }); 
    },
    
    //Call to custom function
    loadStudentsGrades: function(){
         var students = Ext.getStore("students").data.items;
         var grades = Ext.getStore("studentGrades").data.items;
         //console.log(students);
         //console.log(grades);
         
         students.forEach(function(student){
             var counter = 0;
             
            grades.forEach(function(grade){
                // console.log(students[0]);
                // console.log(grade);
                if(grade.data.studentId == 1358788)//student.id)
                {
                    console.log(student.data.grade);
                    student.data.grade = student.data.grade + grade.data.value;
                    counter ++;
                }
             })
             student.data.grade = student.data.grade / counter;
             //console.log(student.data.grade);
         })
         Ext.getStore("students").loadData(students, [false]);
	},
    
    onStateChange:function(grid, rowIndex, colIndex){
        var me = this;
        var store = grid.getStore(), id = store.getAt(rowIndex).data.studentId, data = store.getAt(rowIndex).data;
        console.log(id); 
        Ext.Ajax.request({
                url: '/api/views_table/'+ id,
                success: function(){
                    store.load();
                    console.log("success");
                    me.changeIcon();
                },
                failure: this.updateError,
                jsonData :data,
                disableCaching:true,
                method:'PUT'		   
        }); 
        
    },
    
    updateError: function () {
        console.log("Error updating")
    },
    

	onStatesLoaded: function(store, records) {
		var filter = store.getStoreId().replace(/States/, 'Filter');
		this.model.set(filter, records);
	},

    changeIcon: function (){
	    console.log('testing changeIcon');
        var me  =this;
        var mainStore = Ext.getStore('studentgradesview');
        
        var green = false;
        var yellow = false;
        var red = false;
        
        mainStore.data.items.forEach(function(item){
            if(item.data.gradeStatus ==  'Accepted'){
                Ext.getCmp('topIcon').setSrc('/resources/images/icons/Green.ico');
		green = true;
            }
            if(item.data.gradeStatus ==  'Pending'){
		Ext.getCmp('topIcon').setSrc('/resources/images/icons/Yellow.ico');
		yellow = true
            }
            if(item.data.gradeStatus ==  'Rejected'){
                Ext.getCmp('topIcon').setSrc('/resources/images/icons/Red.ico');
		red = true;
            }
            if(green && yellow){
	        Ext.getCmp('topIcon').setSrc('/resources/images/icons/YellowGreen.ico');
	    }
	    if(green && red){
		Ext.getCmp('topIcon').setSrc('/resources/images/icons/RedGreen.ico');
	    }
	    if(red && yellow){
		Ext.getCmp('topIcon').setSrc('/resources/images/icons/RedYellow.ico');
	    }
	    if(red && yellow && green){
		Ext.getCmp('topIcon').setSrc('/resources/images/icons/RedYellowGreen.ico');
            }
	})
    },

	onFilterChange: function(selModel, selections) {
        var me = this;
        me.changeIcon();    
		var filter = selections.map(function(r) { return r.get('abbr'); });
		this.model.getStore(selModel.storeId).filter('abbr', Ext.isEmpty(filter) ? 'XX' : filter);
		// update intermediate state
gfilter = filter;
	},

	onCheckChange: function(checkbox) {
		var model = checkbox.up('toolbar').down('dataview').getSelectionModel();
		if (checkbox.checked == true)
		{
			model.selectAll();
		}
		else
		{
			model.deselectAll();
		}
	},
	
	statusManager: function(){
		console.log('testing function');
        var states;
		var mainStore = Ext.getStore('studentgradesview');
		var changeTo = Ext.getCmp('allButton').text;
		console.log(changeTo);
		var dataArr = [];
		mainStore.data.items.forEach(function(item){
			if(changeTo==='Accept-All'){
				states = 'Pending';
				dataArr.push(item);
			}
			if(changeTo ==='Pending-All'){
				states = 'Rejected';
				dataArr.push(item);
			}
			if(changeTo === 'Reject-All'){
				states = 'Accepted';
				dataArr.push(item);
			}
		});
        Ext.Ajax.request({
            url: '/api/views_table/changeAll',
            success: function(){
                Ext.getStore('studentgradesview').load();
                
                if(changeTo ==='Accept-All'){
                    Ext.getCmp('allButton').setText('Reject-All');
                }
                else if(changeTo ==='Reject-All'){
                    Ext.getCmp('allButton').setText('Pending-All');
                }
                else if(changeTo === 'Pending-All'){
                    Ext.getCmp('allButton').setText('Accept-All');
                }
                this.changeIcon();
                mainStore.load();
                
            },
            failure: this.updateError,
            jsonData: states,
            disableCaching: true,
            method: 'PUT'
        });
	},

	doExportStudents: function(){

		Ext.Ajax.request({
			url: '/api/students',
			success: function(resp) {
				JSONToCSVConvertor(resp.responseText, "Student Report", true);
			}
		});
	},
	doExportJudges: function(){

		Ext.Ajax.request({
			url: '/api/judges',
			success: function(resp) {
				JSONToCSVConvertor(resp.responseText, "Judge List", true);
			}
		});
	}

});




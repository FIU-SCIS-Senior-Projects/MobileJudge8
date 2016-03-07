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
        var status = null;
	},
    
    returnData: function(){
            return this.dataArray;
    },
    
    getAverage: function(data){
        var average = 0;
        
        data.forEach(function(item){
            if(item.grade)
                average = average + item.grade;
            else if(item.gradeAverage)
                average = average + item.gradeAverage;
            else
                average = average + item.value;
        })
        return (average / data.length);
    },
    
    changeStatus: function(status){
        var value;
        if(status == "Pending"){
            value = "Accepted";
        }
        else if(status == "Accepted"){
            value = "Rejected";
        }
        else
        {
            value = "Pending";
        }
        
        return value;
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
         
         students.forEach(function(student){
             var counter = 0;
             
            grades.forEach(function(grade){
                
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
        var store = grid.getStore(), id = store.getAt(rowIndex).data.studentId, data = store.getAt(rowIndex).data, index = rowIndex;
        console.log(id); 
        Ext.Ajax.request({
                url: '/api/views_table/'+ id,
                success: function(){
                    var currentStatus = store.data.items[index].data.gradeStatus;
                    store.data.items[index].data.gradeStatus = me.changeStatus(currentStatus);
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
    
    saveEditedData: function(){
        var me = this;
        var store = Ext.getStore('judgeGrades');
        var data = [];
        store.data.items.forEach(function(obj){
            data.push(obj.data);
        })
        Ext.Ajax.request({
            url: '/api/third_view_save_edited',
            success: function(response){
                var data = JSON.parse(response.responseText)
                //store.loadData(data);
                me.loadThirdViewData(data[0]);
            },
            failure: this.updateError,
            jsonData : data,
            disableCaching:true,
            method:'POST'		   
        });
    },
    
    loadSecondViewData: function(data){
        var me = this;
        Ext.Ajax.request({
            url: '/api/second_view',
            success: function(response){
                var data = JSON.parse(response.responseText)
                Ext.getStore('studentDetailData').loadData(data);
                var average = me.getAverage(data);
                Ext.getCmp('gradeLabel').setText(average);
            },
            failure: this.updateError,
            jsonData : data,
            disableCaching:true,
            method:'POST'		   
        });
    },
    
    loadThirdViewData: function(data){
        Ext.Ajax.request({
            url: '/api/third_view',
            success: function(response){
                var data = JSON.parse(response.responseText)
                Ext.getStore('judgeGrades').loadData(data);
            },
            failure: this.updateError,
            jsonData : data,
            disableCaching:true,
            method:'POST'		   
        });
    },
    
    changeStatusThirdView: function(grid, rowIndex, colIndex){
        var me = this;
        var store = Ext.getStore('judgeGrades'), status;
        var data = [];
        var changeTo = Ext.getCmp('detailAllThirdButton').text;
        
        if(!isNaN(rowIndex)){
           data.push(store.data.items[rowIndex].data);
           
           if(data[0].accepted === "Accepted")
                status = "Rejected"
           else if(data[0].accepted === "Rejected")
                status = "Pending";
           else 
                status = "Accepted"; 
        }
        else{
            if(changeTo==='Accept-All'){
                status = 'Accepted';
                Ext.getCmp('detailAllThirdButton').setText('Reject-All');
            }
            else if(changeTo ==='Pending-All'){
                status = 'Pending';
                Ext.getCmp('detailAllThirdButton').setText('Accept-All');
            }
            else{
                status = 'Rejected';
                Ext.getCmp('detailAllThirdButton').setText('Pending-All');
            }
            
            store.data.items.forEach(function(item){
                data.push(item.data);
            })
        }
        var sendData = {
            data: data,
            state: status
        };
        
        Ext.Ajax.request({
                url: '/api/third_view_save',
                success: function(){
                    me.loadThirdViewData(data[0]);
                },
                failure: this.updateError,
                jsonData :sendData,
                disableCaching:true,
                method:'PUT'		   
        });
    },
    
    changeStatusSecondView: function(grid, rowIndex, colIndex){
        var me = this;
        var store = Ext.getStore('studentDetailData'), status;
        var data = [];
        var changeTo = Ext.getCmp('detailAllButton').text;
        
        if(!isNaN(rowIndex)){
           data.push(store.data.items[rowIndex].data);
           
           if(data[0].gradeStatus === "Accepted")
                status = "Rejected"
           else if(data[0].gradeStatus === "Rejected")
                status = "Pending";
           else 
                status = "Accepted"; 
        }
        else{
            if(changeTo==='Accept-All'){
                status = 'Accepted';
                Ext.getCmp('detailAllButton').setText('Reject-All');
            }
            else if(changeTo ==='Pending-All'){
                status = 'Pending';
                Ext.getCmp('detailAllButton').setText('Accept-All');
            }
            else{
                status = 'Rejected';
                Ext.getCmp('detailAllButton').setText('Pending-All');
            }
            
            store.data.items.forEach(function(item){
                data.push(item.data);
            })
        }
        
        var sendData = {
            data: data,
            state: status
        };
        
        Ext.Ajax.request({
                url: '/api/second_view_save',
                success: function(){
                    me.loadSecondViewData(data[0]);
                },
                failure: this.updateError,
                jsonData :sendData,
                disableCaching:true,
                method:'PUT'		   
        }); 
        
    },
    
    updateMainStore: function () {
        //console.log("THIS IS GOING TO BE THE CLOSE ");
        var me = this;
        var mainStore = Ext.getStore('studentgradesview');
        me.changeIcon();
        mainStore.load();
    },

	onStatesLoaded: function(store, records) {
		var filter = store.getStoreId().replace(/States/, 'Filter');
		this.model.set(filter, records);
	},

    changeIcon: function (){
	    //console.log('testing changeIcon');
        var me  =this;
        var items;
        
        if(me.status === null || !me.status)
            items = Ext.getStore('studentgradesview').data.items;
        else
            items = [{data:{gradeStatus: me.status}}];
        
        var green = false;
        var yellow = false;
        var red = false;
        
        items.forEach(function(item){
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
        var me = this;
        var data = {
            ids: null,
            state: null
        };
        var ids = [];
        var mainStore = Ext.getStore('studentgradesview');
		var changeTo = Ext.getCmp('allButton').text;
        
        //Getting the Ids to be modified
        mainStore.data.items.forEach(function(row){
            ids.push(row.data.studentId);
        })
        data['ids'] = ids;
        
        if(changeTo==='Accept-All'){
            data['state'] = 'Accepted';
        }
        if(changeTo ==='Pending-All'){
            data['state'] = 'Pending';
        }
        if(changeTo === 'Reject-All'){
            data['state'] = 'Rejected';
        }
        
        Ext.Ajax.request({
            url: '/api/views_table_changeAll',
            success: function(){
                
                //Changing the value of the button to reflect the next stage to change to
                if(changeTo ==='Accept-All'){
                    Ext.getCmp('allButton').setText('Reject-All');
                }
                else if(changeTo ==='Reject-All'){
                    Ext.getCmp('allButton').setText('Pending-All');
                }
                else if(changeTo === 'Pending-All'){
                    Ext.getCmp('allButton').setText('Accept-All');
                }
                //Little hack to get the Icon to update and not have to loop through the store when calling changeIcon
                me.status = data['state'];
                
                me.changeIcon();
                mainStore.load();
                me.status = null;
                
            },
            failure: this.updateError,
            jsonData: data,
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




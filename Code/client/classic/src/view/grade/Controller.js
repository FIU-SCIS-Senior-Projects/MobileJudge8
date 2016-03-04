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
        var me  =this;
        var mainStore = Ext.getStore('studentgradesview');
        
        var green = false;
        var yellow = false;
        var red = false;
        
        mainStore.data.items.forEach(function(item){
            if(item.data.gradeStatus ==  'Accepted'){
                document.getElementById("topIcon").src = '/resources/images/icons/Green.ico';
                green = true;
            }
            if(item.data.gradeStatus ==  'Pending'){
                document.getElementById("topIcon").src = '/resources/images/icons/Yellow.ico';
                yellow = true
            }
            if(item.data.gradeStatus ==  'Rejected'){
                document.getElementById("topIcon").src = '/resources/images/icons/Red.ico' ;
                red = true;
            }
            
            if(green && yellow)
                document.getElementById("topIcon").src = '/resources/images/icons/YellowGreen.ico';
            if(green && red)
                document.getElementById("topIcon").src = '/resources/images/icons/RedGreen.ico';
            if(red && yellow)
                document.getElementById("topIcon").src = '/resources/images/icons/RedYellow.ico';
            if(red && yellow && green)
                document.getElementById("topIcon").src = '/resources/images/icons/RedYellowGreen.ico';
        })
        me.updateLayout();
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

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
	//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
	var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

	var CSV = '';
	//Set Report title in first row or line

	CSV += ReportTitle + '\r\n\n';

	//This condition will generate the Label/Header
	if (ShowLabel) {
		var row = "";

		//This loop will extract the label from 1st index of on array
		for (var index in arrData[0]) {

			//Now convert each value to string and comma-seprated
			row += index + ',';
		}

		row = row.slice(0, -1);

		//append Label row with line break
		CSV += row + '\r\n';
	}

	//1st loop is to extract each row
	for (var i = 0; i < arrData.length; i++) {
		var row = "";

		//2nd loop will extract each column and convert it in string comma-seprated
		for (var index in arrData[i]) {
			row += '"' + arrData[i][index] + '",';
		}

		row.slice(0, row.length - 1);

		//add a line break after each row
		CSV += row + '\r\n';
	}

	if (CSV == '') {
		alert("Invalid data");
		return;
	}

	//Generate a file name
	var fileName = "Downloaded_";
	//this will remove the blank-spaces from the title and replace it with an underscore
	fileName += ReportTitle.replace(/ /g,"_");

	//Initialize file format you want csv or xls
	var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

	// Now the little tricky part.
	// you can use either>> window.open(uri);
	// but this will not work in some browsers
	// or you will not get the correct file extension

	//this trick will generate a temp <a /> tag
	var link = document.createElement("a");
	link.href = uri;

	//set the visibility hidden so it will not effect on your web-layout
	link.style = "visibility:hidden";
	link.download = fileName + ".csv";

	//this part will append the anchor tag and remove it after automatic click
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}


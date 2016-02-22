Ext.define('MobileJudge.view.grade.Wizard', {
    extend: 'Ext.window.Window',
    alias: 'widget.grademodal',
    requires: [
        'Ext.button.Button',
        'Ext.form.field.Radio',
        'Ext.form.*',
        'Ext.layout.container.Accordion',
	    'Ext.layout.container.Card'
    ],
    
    // cls: 'wizarddone',
    // userCls: 'big-50 small-100',
    
    //layout: 'card',
    tpl: [
            '<p>Id: {id} - Name: {fullName} - Project: {project} - Grade: {grade}</p>'
        ],
    
    bodyPadding: 10,
    scrollable: true,
    controller: 'people',
    
    width: 500,
    height: 400,
    title: 'Student Detail',
    initComponent: function() {
        this.callParent(arguments);
    },

    loadData: function(rec){
        // controller = new MobileJudge.view.people.PeopleController();
        //controller.loadStudentInfoWithJudgeInfo();
        this.update(rec.data);
        //this.update(rec.data.name + ' - ' + rec.data.email);
        Ext.create('studentsdetails');
        // Ext.getStore('studentGrades').filterBy(function(rec, id) {
        //     if (Ext.Array.indexOf(newValue,rec.get('studentId')) >= 0)
        //         return true;
        //     else
        //         return false;
        //     });
        //MobileJudge.app.getController('PeopleController').loadStudentInfoWithJudgeInfo(rec.data.studentId);        
    },
    
    items: [
        {
            xtype: 'studentsdetails'
        }
    ]
})




Ext.define('MobileJudge.view.grade.Studentsdetails', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.studentsdetails',
    title: 'Simpsons',
    store: 'studentgradesview',
    initComponent: function() {
         this.callParent()
    },
    columns: [{
        text: 'Id',
        dataIndex: 'judgeId'
    }],
    floating: false,
    draggable: false,
    modal: true,
    closable: false,
    height: 200,
    width: 300,
    renderTo: Ext.get('grademodal'),
});




// Ext.define('MobileJudge.ux.grade.StudentsDetails', {
// 	extend: 'Ext.grid.Panel',
// 	xtype: 'studentsdetails',

// 	userCls: 'user-grid shadow',
// 	title: 'Students Details',

// 	tools: [
// 		{
// 			type: 'refresh',
// 			handler: 'onStudentsRefresh'
// 		}
// 	],

// 	viewConfig: {
// 		stripeRows: true,
// 		enableTextSelection: false,
// 		loadMask: false,
// 		markDirty: false
// 	},

// 	disableSelection: true,
// 	enableColumnHide: false,
// 	enableColumnMove: false,
// 	enableColumnResize: false,
// 	sortableColumns: false,
// 	headerBorders: false,
// 	columns:[
// 		{
// 			renderer: function(value) {
// 				return "<img class='profilePic' src='" + value + "' alt='Profile Pic' height='40px' width='40px'>";
// 			},
// 			width: 75,
// 			dataIndex: 'profileImgUrl',
// 			text: ''
// 		},
// 		{
// 			dataIndex: 'fullName',
// 			text: 'Name',
// 			flex: 1
// 		},
// 		{
// 			dataIndex: 'project',
// 			text: 'Project',
// 			flex: 2
// 		}
// 	]
// });





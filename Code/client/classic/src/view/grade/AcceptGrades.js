Ext.define('MobileJudge.view.grade.Wizard', {
    extend: 'Ext.window.Window',
    alias: 'widget.acceptgradewizard',
    requires: [
        'Ext.button.Button',
        'Ext.form.field.Radio',
        'Ext.form.*',
        'Ext.layout.container.Accordion',
	    'Ext.layout.container.Card',
        'Ext.Component'
    ],
    
    bodyPadding: 10,
    scrollable: true,
    controller: 'grade',
    modal : true,
    listeners: {
      close: function(){
         var ctrl = this.getController();
         var grades = Ext.getStore("judgeGrades").data.items;
         ctrl.loadSecondViewData(grades[0].data);
      }  
    },
    
    width: 550,
    height: 450,
    title: 'Student Grade by One Judge', 
    initComponent: function() {
        this.callParent(arguments);
    },

    loadData: function(record){
        var ctrl = this.getController();
        $("#judgeThirdLabel").text(record.data.judgeName);
        $("#studentThirdLabel").text(record.data.fullName);
        $("#projectThirdLabel").text(record.data.project);
        $("#gradeThirdLabel").text(record.data.gradeAverage);
        ctrl.loadThirdViewData(record.data);
    },
    
    tbar: {
        items: [
            {
                xtype: 'panel', 
                width: 375,
                items: [
                        {
                          items: [
                                {
                                    xtype: 'label',
                                    text: 'Judge:',
                                    readOnly : true
                                },
                                {
                                    id: 'judgeThirdLabel',
                                    xtype: 'label',
                                    text: 'Masoud Sadjadi',
                                    readOnly : true,
                                    style:'padding:0px 0px 0px 30px'
                                }
                          ]
                        },
                        {
                          items: [
                                {
                                    xtype: 'label',
                                    text: 'Student:',
                                    readOnly : true
                                },
                                {
                                    id: 'studentThirdLabel',
                                    xtype: 'label',
                                    text: 'Rodolfo Viant',
                                    readOnly : true,
                                    style:'padding:0px 0px 0px 22px'
                                }
                          ]
                        },
                        {
                            items: [
                                {
                                    xtype: 'label',
                                    text: 'Project:',
                                    readOnly : true
                                },
                                {
                                    id: 'projectThirdLabel',
                                    xtype: 'label',
                                    text: 'Mobile Judge 8',
                                    readOnly : true,
                                    style:'padding:0px 0px 0px 23px'
                                }
                          ]
                        },
                        {
                            items: [
                                {
                                    xtype: 'label',
                                    text: 'Grade:',
                                    readOnly : true
                                },
                                {
                                    id: 'gradeThirdLabel',
                                    xtype: 'label',
                                    text: '8',
                                    readOnly : true,
                                    style:'padding:0px 0px 0px 28px'
                                }
                          ]
                        }
                ]
            },
            {
                id: 'detailAllThirdButton',
                xtype: 'image',
                hight: 30,
                src: '/resources/images/icons/Green.ico',
                width: 40,
                dataIndex: 'bool',
                sortable: false,
                hideable: false,
                listeners: {
                    el: {
                        click: 'changeStatusThirdView'
                    }
                },
                tooltip: 'Accept-All',
                layout: {
                    align: 'right' 
                }
            }
        ],
        renderTo: Ext.getBody()
	},
    
    items: [
        {
            xtype: 'acceptGrade'
        }
    ]
});

Ext.define('MobileJudge.view.grade.acceptGrade', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.acceptGrade',
    store: 'judgeGrades',
    requires: [
		'Ext.grid.plugin.RowEditing',
		'Ext.grid.column.Action',
		'Ext.form.field.Checkbox',
		'Ext.form.field.Number',
		'Ext.form.field.Text',
		'Ext.toolbar.Toolbar'
	],
    plugins: [
		{
			ptype: 'cellediting',
            clicksToEdit: 1,
            listeners: {
				edit: "saveEditedData"
			}
		}
	],
    
    initComponent: function() {
         this.callParent()
    },
    columns: [
        {
        xtype: 'gridcolumn',
        text: 'Question',
        dataIndex: 'question',
        flex: 2,
        width:200
    },{
        xtype: 'gridcolumn',
        text: 'Grade',
        dataIndex: 'grade',
        flex: 2,
        width:70,
        clearOnReset: true,
        editor: {
				xtype: 'textfield',
				minValue: 1,
				maxValue: 10,
				allowBlank: false
			}
    },{
        xtype: 'gridcolumn',
        text: 'Comment',
        dataIndex: 'comment',
        flex: 2,
        width:300,
            
    },
    {
        xtype: 'actioncolumn',
        text: 'Status',
        flex: 1,
        items: [
            {
                icon: '/resources/images/icons/Green.ico',
                tooltip: 'Status',
                handler: 'changeStatusThirdView'
            }  
        ],
        renderer: function (value, metadata, record) {
            if(record.get('accepted') != null){
                if (record.get('accepted').toLowerCase() == "pending") {
                    this.items[0].tooltip = 'Pending';
                    this.items[0].icon = '/resources/images/icons/Yellow.ico';
                }else if (record.get('accepted').toLowerCase() == "accepted") {
                    this.items[0].tooltip = 'Accepted';
                    this.items[0].icon = '/resources/images/icons/Green.ico';
                } else {
                    this.items[0].tooltip = 'Rejected';
                    this.items[0].icon = '/resources/images/icons/Red.ico'; 
                }
            }
        },
        width: 40,
        dataIndex: 'bool',
        sortable: false,
        hideable: false
    }],
    floating: false,
    draggable: false,
    modal: true,
    closable: false,
    height: 300,
    width: 500,
    scrollable: false,
    renderTo: Ext.get('acceptgrademodal')
});

Ext.create('Ext.data.Store', {
    storeId:'judgeGrades',
    fields:['question', 'comment', 'grade'],
    data:{'items':[
        { 'question': 'First Question',  "comment":"This is great comment is not too long",  "grade":9},
        { 'question': 'Second Question',  "comment":"This is great comment is not too long",  "grade":9},
        { 'question': 'Thids Question',  "comment":"This is great comment is not too long",  "grade":9},
        { 'question': 'Fourth Question',  "comment":"This is great",  "grade":9},
        { 'question': 'Fifth Question',  "comment":"This is great",  "grade":9}
    ]},
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});
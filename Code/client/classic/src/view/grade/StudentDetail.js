Ext.create('Ext.data.Store', {
    storeId:'studentDetailData',
    listeners:{
        load : function() {
                var grid = Ext.getCmp("judgeaveragegrade");
				console.log('userStore load fired')
			}
    },
    fields:['judgeName', 'gradeAverage', 'status'],
    data:[]
});

Ext.define('MobileJudge.view.grade.GradeStudentDetailWizard', {
    extend: 'Ext.window.Window',
    alias: 'widget.gradestudentdetailwizard',
    requires: [
        'Ext.button.Button',
        'Ext.form.field.Radio',
        'Ext.form.*',
        'Ext.layout.container.Accordion',
	    'Ext.layout.container.Card',
        'Ext.Component'
    ],
  
    cls: 'wizardone',
    layout: 'card',
    listeners: {
      close: "updateMainStore"  
    },
  
    bodyPadding: 10,
    scrollable: false,
    controller: 'grade',
    modal : true,
    
    width: 600,
    height: 500,
    title: 'Student Grades by Judges', 
    
    initComponent: function() {
        this.callParent(arguments);
    },

    loadData: function(record) {
        var ctrl = this.getController();
        
        $("#nameLabel").text(record.data.fullName);
        $("#projectLabel").text(record.data.project);
        $("#gradeLabel").text(record.data.grade);
        ctrl.loadSecondViewData(record.data);
        
    },
    
    tbar: {
        items: [
            {
                id: 'thePanel',
                xtype: 'panel', 
                width: 400,
                items: [
                        {
                          items: [
                                {
                                    xtype: 'label',
                                    text: 'Name:',
                                    readOnly : true
                                },
                                {
                                    id: 'nameLabel',
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
                                    text: 'Project:',
                                    readOnly : true
                                },
                                {
                                    id: 'projectLabel',
                                    xtype: 'label',
                                    text: 'Mobile Judge 8',
                                    readOnly : true,
                                    style:'padding:0px 0px 0px 25px'
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
                                    id: 'gradeLabel',
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
                id: 'detailAllButton',
                xtype: 'image',
                hight: 30,
                src: '/resources/images/icons/Green.ico',
                width: 40,
                dataIndex: 'bool',
                sortable: false,
                hideable: false,
                listeners: {
                    el: {
                        click: 'changeStatusSecondView'
                    }
                },
                tooltip: 'Accept-All',
                layout: {
                    //pack: 'justify',
                    align: 'right' // align center is the default
                }
            }
        ],
        renderTo: Ext.getBody()
	},
    
    items: [
        {
            itemId: 'middle',
            xtype: 'judgeaveragegrade',
            flex: 1
        }
    ]
});

Ext.define('MobileJudge.view.grade.JudgeAverageGrade', {
    extend:'Ext.grid.Panel',
    alias: 'widget.judgeaveragegrade',
    store: 'studentDetailData',
    initComponent: function() {
         this.callParent()
    },
    listeners: {
        afterrender:function (value, metadata, record){
          console.log("Got here")  
        },
        cellclick: function (iView, iCellEl, iColIdx, iStore, iRowEl, iRowIdx, iEvent) {
            var zRec = iColIdx;
            var data = Ext.getStore("studentDetailData").data.items[iRowIdx];

            if (zRec < 2){
                Ext.widget('acceptgradewizard').show().loadData(data);
                
            }
        }
    },
    columns: [
        {
            xtype: 'gridcolumn',
            text: 'Judge',
            dataIndex: 'judgeName',
            flex: 2,
            width:120
        },{
            xtype: 'gridcolumn',
            text: 'Grade',
            dataIndex: 'gradeAverage',
            flex: 2,
            width:70
        },
        {
            id: 'secondViewStatus',
            xtype: 'actioncolumn',
            text: 'Status',
            flex: 1,
            items: [
                {
                    icon: '/resources/images/icons/Green.ico',
                    tooltip: 'Status',
                    handler: 'changeStatusSecondView'
                }  
            ],
            renderer: function (value, metadata, record) {
                
                if(record.get('accepted') != null){
                    var green = false;
                    var red = false;
                    var yellow = false;
                    
                    //var ctlr = this.up().up().up().getController();
                    //ctlr.changeIcon();
                    
                    if (record.get('pending') == true) {
                        this.items[0].tooltip = 'Pending';
                        this.items[0].icon = '/resources/images/icons/Yellow.ico';
                        yellow = true;
                    }
                    if (record.get('accepted') == true) {
                        this.items[0].tooltip = 'Accepted';
                        this.items[0].icon = '/resources/images/icons/Green.ico';
                        green = true;
                    } 
                    if(record.get('rejected') == true){
                        this.items[0].tooltip = 'Rejected';
                        this.items[0].icon = '/resources/images/icons/Red.ico'; 
                        red = true;
                    }
                    
                    if (green && red && yellow) {
                        this.items[0].tooltip = 'Acc && Pen && Rej';
                        this.items[0].icon = '/resources/images/icons/RedYellowGreen.ico'; 
                    }else if(green && red) {
                        this.items[0].tooltip = 'Acc && Rej';
                        this.items[0].icon = '/resources/images/icons/RedGreen.ico'; 
                    }else if(green && yellow) {
                        this.items[0].tooltip = 'Acc && Pen && Rej';
                        this.items[0].icon = '/resources/images/icons/YellowGreen.ico'; 
                    }else if(yellow && red) {
                        this.items[0].tooltip = 'Acc && Pen && Rej';
                        this.items[0].icon = '/resources/images/icons/RedYellow.ico'; 
                    }
                }
                
            },
            width: 40,
            dataIndex: 'bool',
            sortable: false,
            hideable: false
        }
    ],
    floating: false,
    draggable: false,
    modal: true,
    closable: false,
    height: 500,
    width: 375,
    renderTo: Ext.get('grademodal')
});

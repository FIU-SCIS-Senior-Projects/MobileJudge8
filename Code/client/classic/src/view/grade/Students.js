Ext.define('MobileJudge.view.grade.Students', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gradestudents',

    requires: [
        'Ext.grid.plugin.RowEditing',
        'Ext.grid.column.Action',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.toolbar.Toolbar',
        'Ext.Viewport'
    ],

    bind: '{studentgradesview}',
    userCls: 'big-50 small-100',

    references: 'gridStudents',

    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        }),
        Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 1
        })
    ],

    listeners: {
        painted: 'loadStudentsGrades',
        cellclick: function (iView, iCellEl, iColIdx, iStore, iRowEl, iRowIdx, iEvent) {
            var zRec = iColIdx;
            var data = Ext.getStore("studentgradesview").data.items[iRowIdx];

            if (zRec < 3)
                Ext.widget('gradestudentdetailwizard').show().loadData(data);
        }
    },

    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    xtype: 'checkboxfield',
                    checked: true,
                    handler: 'onCheckChange'
                    
                },
                {
                    xtype: 'dataview',
                    cls: 'stateSelector',
                    loadMask: false,
                    trackOver: false,
                    itemSelector: '.stateSelector button',
                    selectedItemCls: 'selected',
                    selectionModel: {
                        type: 'dataviewmodel',
                        storeId: 'students',
                        mode: 'SIMPLE'
                    },
                    tpl: [
                        '<tpl for=".">',
                        '<button type="button" title="{name}">{abbr}</button>',
                        '</tpl>'
                    ],
                    bind: {
                        selection: '{studentFilterSelection}',
                        store: '{studentStates}'
                    },
                    listeners: {
                        selectionchange: 'onFilterChange'
                    }
                },
                '->',
                {
                    xtype: 'searchfilter',
                    width: 400,
                    fieldLabel: 'Search',
                    labelWidth: 50,
                    bind: {
                        store: '{students}'
                    }
                },
                '->',
                {
                    xtype: 'image',
                    flex: 1,
                    src: '/resources/images/icons/Yellow.ico',
                    // items: [
                    //             {
                    //                 icon: '/resources/images/icons/favicon(2).ico',
                    //                 handler: 'onStateChange'
                    //             } 
                    // ],
                    renderer: function (value, metadata, record) {
                        // if (record.get('gradeStatus').toLowerCase() == "pending") {
                        //     this.items[0].tooltip = 'Pending';
                        //     this.items[0].icon = '/resources/images/icons/favicon(2).ico';
                        // }else if (record.get('gradeStatus').toLowerCase() == "accepted") {
                        //     this.items[0].tooltip = 'Accepted';
                        //     this.items[0].icon = '/resources/images/icons/favicon(4).ico';
                        // } else {
                        //     this.items[0].tooltip = 'Rejected';
                        //     this.items[0].icon = '/resources/images/icons/favicon(3).ico'; 
                        // }
                    },
                    width: 40,
                    dataIndex: 'bool',
                    sortable: false,
                    hideable: false
                },
                {
                    ui: 'soft-blue',
                    xtype: 'button',
                    text: 'Accept-All',
                    handler: 'statusManager',
                    flex: 1
                },
                {
                    ui: 'soft-blue',
                    glyph: '',
                    iconCls: 'x-fa fa-cloud-download',
                    text: 'Export Grades',
                    handler: 'doExportStudents',
                    flex: 1
                }
            ]
        },
        {
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            bind: '{students}',
            showPageCombo: true //This config enables the page size select combo box
        }
    ],

    columns: [
        {
            xtype: 'gridcolumn',
            dataIndex: 'projectName',
            text: 'Project',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'fullName',
            text: 'Name',
            flex: 1
        },
        {
        	xtype: 'gridcolumn',
        	dataIndex: 'grade',
        	text: 'Grade',
        	flex: 1
        },
        {
            id: 'status',
            xtype: 'actioncolumn',
            text: 'Status',
            flex: 1,
            items: [
                {
                    icon: '/resources/images/icons/Yellow.ico',
                    tooltip: 'Status',
                    handler: 'onStateChange'
                } 
            ],
            renderer: function (value, metadata, record) {
                if (record.get('gradeStatus').toLowerCase() == "pending") {
                    this.items[0].tooltip = 'Pending';
                    this.items[0].icon = '/resources/images/icons/Yellow.ico';
                }else if (record.get('gradeStatus').toLowerCase() == "accepted") {
                    this.items[0].tooltip = 'Accepted';
                    this.items[0].icon = '/resources/images/icons/Green.ico';
                } else {
                    this.items[0].tooltip = 'Rejected';
                    this.items[0].icon = '/resources/images/icons/Red.ico'; 
                }
            },
            width: 40,
            dataIndex: 'bool',
            sortable: false,
            hideable: false
        }

        // {
        //     xtype: 'actioncolumn',
        //     //dataIndex: 'gradeStatus',
        //     text: 'Status',
        //     flex: 1,
        //     trackMouse: true,
        //     // editor: {
        //     //     xtype: 'combo',
        //     //     editable: false,
        //     //     store: [
        //     //         'Accepted',
        //     //         'Rejected',
        //     //         'Pending'
        //     //     ],
        //     items: [
        //         {
        //             iconCls: 'fa fa-dot-circle-o',
        //             tooltip: 'Status',
        //             handler: 'onStateChange', 
        //         }
        //     ]
        //         // listeners: {
        //         //     change: function(iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent){
        //         //         //console.log(gridPanel.getSelectionModel().getCurrentPosition());
        //         //         console.log(iRecord); 
        //         //     },
        //         //     onCancel: function(iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent){
        //         //         var grades = Ext.getStore("studentGrades").data.items;
        //         //         grades.forEach(function(element) {
        //         //             //if()
        //         //         }, this);
        //         //     },
        //         //     // onItemUpdate: function(){
        //         //     //     alert("It works");
        //         //     // }
        //         // }
        //     //}
        // }//,// {
        //     xtype: 'actioncolumn',
        //     //dataIndex: 'gradeStatus',
        //     text: 'Status',
        //     flex: 1,
        //     trackMouse: true,
        //     // editor: {
        //     //     xtype: 'combo',
        //     //     editable: false,
        //     //     store: [
        //     //         'Accepted',
        //     //         'Rejected',
        //     //         'Pending'
        //     //     ],
        //     items: [
        //         {
        //             iconCls: 'fa fa-dot-circle-o',
        //             tooltip: 'Status',
        //             handler: 'onStateChange', 
        //         }
        //     ]
        //         // listeners: {
        //         //     change: function(iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent){
        //         //         //console.log(gridPanel.getSelectionModel().getCurrentPosition());
        //         //         console.log(iRecord); 
        //         //     },
        //         //     onCancel: function(iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent){
        //         //         var grades = Ext.getStore("studentGrades").data.items;
        //         //         grades.forEach(function(element) {
        //         //             //if()
        //         //         }, this);
        //         //     },
        //         //     // onItemUpdate: function(){
        //         //     //     alert("It works");
        //         //     // }
        //         // }
        //     //}
        // }//,
    ]
});

// Ext.override(Ext.grid.RowEditor, {
//         completeEdit: function() {
//         var me = this,
//             form = me.getForm();

//         if (!form.isValid()) {
//             return false;
//         }
        
//         alert("Got it ");
        
//         me.completing = true;
//         form.updateRecord(me.context.record);
//         me.hide();
//         me.completing = false;
//         return true;
//      }
//     });


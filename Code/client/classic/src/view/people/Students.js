Ext.define('MobileJudge.view.people.Students', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.students',

	requires: [
		'Ext.grid.plugin.RowEditing',
		'Ext.grid.column.Action',
		'Ext.form.field.Checkbox',
		'Ext.form.field.Number',
		'Ext.form.field.Text',
		'Ext.toolbar.Toolbar'
	],

	bind: '{students}',
	references: 'gridStudents',

	dockedItems: [
		{
			xtype: 'toolbar',
			dock: 'top',
			items: [
				{
					xtype: 'checkboxfield',
					checked   : true,
					handler:'onCheckChange'

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
					ui: 'soft-blue',
					glyph:'',
					iconCls: 'x-fa fa-cloud-download',
					text: 'Sync',
					handler: 'onStudentsLoad'
				},

				{
					ui: 'soft-blue',
					glyph:'',
					iconCls: 'x-fa fa-cloud-download',
					text: 'Export Grades',
					handler: 'doExport'
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
			width: 85,
			dataIndex: 'id',
			hideable: false,
			text: 'PantherID'
		},
		{
			xtype: 'gridcolumn',
			renderer: function(value) {
				return "<img class='profilePic' src='" + value + "' alt='Profile Pic' height='40px' width='40px'>";
			},
			width: 75,
			dataIndex: 'profileImgUrl',
			sortable: false,
			hideable: false,
			text: ''
		},
		{
			xtype: 'gridcolumn',
			dataIndex: 'fullName',
			text: 'Name',
			flex: 1
		},
		{
			xtype: 'gridcolumn',
			dataIndex: 'email',
			text: 'Email',
			flex: 1
		},
		{
			xtype: 'gridcolumn',
			dataIndex: 'project',
			text: 'Project',
			flex: 2
		},
		{
			xtype: 'gridcolumn',
			dataIndex: 'location',
			text: 'Location',
			flex: 1
		},
		{
			xtype: 'gridcolumn',
			dataIndex: 'state',
			text: 'State',
			width: 80
		},{
			xtype: 'gridcolumn',
			dataIndex: 'grade',
			text: 'Grade',
			width: 80
		},
		{
			xtype: 'actioncolumn',
			items: [
				{
					iconCls: 'x-fa fa-close',
					tooltip: 'Delete',
					handler: 'onUserDelete'
				}
			],

			width: 40,
			dataIndex: 'bool',
			sortable: false,
			hideable: false
		}
	]
});
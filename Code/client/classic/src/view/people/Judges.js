Ext.define('MobileJudge.view.people.Judges', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.judges',

	requires: [
		'Ext.grid.plugin.RowEditing',
		'Ext.grid.column.Action',
		'Ext.form.field.Checkbox',
		'Ext.form.field.Number',
		'Ext.form.field.Text',
		'Ext.toolbar.Toolbar'
	],

	bind: '{judges}',

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
						storeId: 'judges',
						mode: 'SIMPLE'
					},
					tpl: [
						'<tpl for=".">',
							'<button type="button" title="{name}">{abbr}</button>',
						'</tpl>'
					],
					bind: {
						selection: '{judgeFilterSelection}',
						store: '{judgeStates}'
					},
					listeners: {
						selectionchange: 'onFilterChange',

					}
				},
				'->',
				{
					xtype: 'searchfilter',
					width: 400,
					fieldLabel: 'Search',
					labelWidth: 50,
					bind: {
						store: '{judges}'
					}
				},
				'->',
				{
					xtype: 'form',
					reference: 'judgeUploadForm',
					items: [
						{
							xtype: 'filefield',
							name: 'judgesCsv',
							buttonOnly: true,
							buttonText: 'Import',
							buttonConfig: {
								ui: 'soft-blue',
								glyph:'',
								iconCls: 'x-fa fa-cloud-upload'
							},
							listeners: {
								change: 'onImportJudges'
							}
						}
					]
				}
			]
		},
		{
			xtype: 'pagingtoolbar',
			dock: 'bottom',
			displayInfo: true,
			bind: '{judges}'
		}
	],
	columns: [
		{
			width: 75,
			dataIndex: 'id',
			hideable: false,
			text: ''
		},
		{
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
			dataIndex: 'fullName',
			text: 'Name',
			flex: 1
		},
		{
			dataIndex: 'email',
			text: 'Email',
			flex: 2
		},
		{
			dataIndex: 'title',
			text: 'Title',
			flex: 1
		},
		{
			dataIndex: 'affiliation',
			text: 'Affiliation',
			flex: 1
		},
		{
			dataIndex: 'state',
			text: 'State',
			width: 120
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

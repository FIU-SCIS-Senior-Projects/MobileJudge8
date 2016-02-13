Ext.define('MobileJudge.view.email.RefineSelection', {
	extend: 'Ext.container.Container',
	alias: 'widget.refineselection',

	requires: [
		'Ext.layout.container.Accordion',
		'Ext.grid.Panel',
		'Ext.selection.CheckboxModel'
	],

	cls: 'pages-faq-container FAQPanel',

	layout: {
		type:'vbox',
		align: 'stretch'
	},

	autoScroll: true,

	items: [
		{
			xtype: 'searchfilterwizard',
			maxWidth: 400,
			fieldLabel: 'Search',
			labelWidth: 50,
			bind: {
				storeStudents: '{students}',
				storeJudges: '{judges}'
			}
		},
		{	layout: 'accordion',
			defaults: {
				xtype: 'grid',
				iconCls:'x-fa fa-caret-down',
				selModel: {
					selType: 'checkboxmodel',
					mode: 'SIMPLE',
					listeners: {
						select: 'onChecked',
						deselect: 'onUnchecked'
					}
				},
				enableColumnMove: false,
				enableColumnHide: false,
				enableColumnResize: false,
				viewConfig: {
					loadMask: false,
					filter: true
				},
				columns: [
					{
						text:'Name',
						flex: 1,
						dataIndex: 'fullName'
					},
					{
						text:'Email',
						flex: 1,
						dataIndex: 'email'
					}
				]
			},
			items: [
				{
					name: 'studentGrid',

					bind: {
						store: '{students}',
						selection: '{checkedStudentsSelection}',
						title: 'Students ({selectedStudents.length})'
					},
					listeners: {
						selectionchange: 'onStudentsLoaded'
					}
				},
				{

					bind: {
						store: '{judges}',
						selection: '{judgesSelection}',
						title: 'Judges ({selectedJudges.length})'
					},
					listeners: {
						selectionchange: 'onJudgesLoaded'
					}
				},
				{

					bind: {
						store: '{extraEmails}',
						selection: '{extraSelection}',
						title: 'Extra e-mails ({selectedExtra.length})'
					},
					listeners: {
						selectionchange: 'onExtraSelectionChange'
					}
				}
			]
		}
	]

});

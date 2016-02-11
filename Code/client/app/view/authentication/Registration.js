Ext.define('MobileJudge.view.authentication.Registration', {
	extend: 'Ext.app.ViewModel',
	alias: 'viewmodel.registration',

	data: {
		userid: '',
		firstName: '',
		lastName: '',
		affiliation: '',
		title: '',
		password: '',
		email: '',
		oauth: null,
		persist: false
	},

	stores: {
		conflicts: {
			type: 'students',
			storeId: 'conflicts',
			autoLoad: true,
			remoteSort: false,
			remoteFilter: false,
			pageSize: 0,
			sorters: [
				{
					property: 'fullName',
					direction: 'ASC'
				}
			],
			grouper: {
				groupFn: function(record) {
					return record.get('fullName')[0];
				}
			}
		}
	},

	formulas: {
		isValid: {
			bind: {
				deep: true,
				title: '{title}',
				fullName: '{userName}',
				affiliation: '{affiliation}',
				email: '{email}',
				password: '{password}'
			},
			get: function(data) {
				return !Ext.isEmpty(data.title)
					&& !Ext.isEmpty(data.fullName)
					&& !Ext.isEmpty(data.affiliation)
					&& !Ext.isEmpty(data.password)
					&& !Ext.isEmpty(data.email)
					&& (/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i).test(data.email);
			}
		}
	}
});

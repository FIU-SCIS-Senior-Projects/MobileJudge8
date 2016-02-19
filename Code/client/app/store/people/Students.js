Ext.define('MobileJudge.store.people.Students', {
	extend: 'Ext.data.Store',
	alias: 'store.students',

	model: 'MobileJudge.model.people.Student',

	proxy: {
		type: 'api',
		url: '/api/students'
	},

    autoSync: true,
    autoLoad: true,
	remoteSort: true,
	remoteFilter: true,
	pageSize: 25
});

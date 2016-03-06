Ext.define('MobileJudge.store.people.StudentGradesView', {
	extend: 'Ext.data.Store',
	alias: 'store.studentgradesview',

	model: 'MobileJudge.model.people.StudentGradesView',

	proxy: {
		type: 'api',
		url: '/api/views_table',
        reader: {
            type: 'json',
            root: 'users',
            totalProperty: 'total'
        }
	},

    autoSync: true,
    autoLoad: true,
	remoteSort: true,
	remoteFilter: true,
	pageSize: 25
});
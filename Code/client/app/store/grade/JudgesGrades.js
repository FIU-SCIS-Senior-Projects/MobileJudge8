Ext.define('MobileJudge.store.people.JudgesGrades', {
	extend: 'Ext.data.Store',
	alias: 'store.judgesgrades',

	model: 'MobileJudge.model.people.JudgesGrade',

	proxy: {
		type: 'api',
		url: '/api/judges_grades'
	},

    autoSync: true,
    autoLoad: true,
	remoteSort: true,
	remoteFilter: true,
	pageSize: 25
});
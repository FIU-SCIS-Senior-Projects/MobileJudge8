Ext.define('MobileJudge.model.people.StudentGradesView', {
	extend: 'Ext.data.Model',

    proxy: {
		type: 'api',
		url: '/api/views_table'
	},
    
	fields: [
        { name: 'id',               type: 'int', convert: null },
        { name: 'studentId',          type: 'int' },
		{ name: 'termId',             type: 'int', convert: null },
        { name: 'fullName',          type: 'string' },
        { name: 'grade_display',          type: 'string' },
        { name: 'projectName',          type: 'string' },
        { name: 'gradeStatus',          type: 'string' },
		{ name: 'grade',              type: 'float', convert: null },
		{ name: 'max',                type: 'float', persist: false }
	]
});

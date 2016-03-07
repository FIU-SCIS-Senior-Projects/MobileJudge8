Ext.define('MobileJudge.model.people.StudentGradesView', {
	extend: 'Ext.data.Model',

	fields: [
        { name: 'id',               type: 'int', convert: null },
        { name: 'state',            type: 'string', convert: null },
		{ name: 'abbr',             type: 'string', convert: null },
        { name: 'studentId',          type: 'int' },
		{ name: 'termId',             type: 'int', convert: null },
        { name: 'fullName',          type: 'string' },
        { name: 'grade_display',          type: 'string' },
        { name: 'project',          type: 'string' },
        { name: 'gradeStatus',          type: 'string' },
		{ name: 'grade',              type: 'float', convert: null },
		{ name: 'max',                type: 'float', persist: false }
	]
});

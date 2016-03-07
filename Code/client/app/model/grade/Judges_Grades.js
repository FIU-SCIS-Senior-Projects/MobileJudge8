Ext.define('MobileJudge.model.people.JudgesGrade', {
	extend: 'Ext.data.Model',
    
	fields: [
        { name: 'id',               type: 'int', convert: null },
        { name: 'judge',            type: 'string' },
		{ name: 'student',          type: 'string' },
        { name: 'question',         type: 'string' },
        { name: 'grade',            type: 'int', convert: null },
        { name: 'projectName',      type: 'string' },
        { name: 'comment',          type: 'string' },
		{ name: 'accepted',         type: 'string'}
	]
});
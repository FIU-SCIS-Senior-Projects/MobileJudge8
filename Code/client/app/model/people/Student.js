Ext.define('MobileJudge.model.people.Student', {
	extend: 'Ext.data.Model',

	fields: [
		{ name: 'id',               type: 'int', convert: null },
		{ name: 'state',            type: 'string', convert: null },
		{ name: 'abbr',             type: 'string', convert: null },
		{ name: 'fullName',         type: 'string', convert: null, persist: false },
		{ name: 'email',            type: 'string', convert: null },
		{ name: 'profileImgUrl',    type: 'string', convert: null },
		{ name: 'project',          type: 'string', convert: null },
		//{ name: 'location',         type: 'string', convert: null },
		{ name: 'realLocation',     type: 'string' },
		/*{ name: 'termName',         type: 'string' },
		{ name: 'mapImageUrl',      type: 'string' },*/
		{ name: 'grade',            type: 'float', convert: null },
		{ name: 'max',              type: 'int', convert: null },
		{ name: 'grade_display',    type: 'string' }
	]
});

Ext.define('MobileJudge.model.people.Judge', {
	extend: 'Ext.data.Model',

	fields: [
		{ name: 'id',               type: 'int', convert: null },
		{ name: 'state',            type: 'string' },
		{ name: 'abbr',             type: 'string' },
		{ name: 'firstName',        type: 'string' },
		{ name: 'lastName',         type: 'string' },
		{ name: 'email',            type: 'string' },
		{ name: 'profileImgUrl',    type: 'string' },
		{ name: 'title',            type: 'string' },
		{ name: 'password',         type: 'string' },
		{ name: 'affiliation',      type: 'string' }/*,
		{ name: 'termName',         type: 'string' },
		{ name: 'mapImageUrl',      type: 'string' }*/
	]
});

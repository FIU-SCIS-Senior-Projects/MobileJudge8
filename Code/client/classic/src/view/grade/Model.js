/**
 * Created by rodolfo on 1/29/16.
 */
Ext.define('MobileJudge.view.grade.Model', {
	extend: 'Ext.app.ViewModel',
	alias: 'viewmodel.grade',

	requires: [

	],

	data: {
		studentFilter: [],
		judgeFilter: [],
		studentInfo: null
	},

	formulas: {
		studentFilterSelection: function(get) { return get('studentFilter'); },
		judgeFilterSelection: function(get) { return get('judgeFilter'); },
		getStudent: function(get) {return get('studentInfo'); }
	},

	stores: {
		studentStates: {
			type: 'studentStates',
			storeId: 'studentStates',
			listeners: {
				load: 'onStatesLoaded'
			}
		},
		judgeStates: {
			type: 'judgeStates',
			storeId: 'judgeStates',
			listeners: {
				load: 'onStatesLoaded'
			}
		},
		students: {
			type: 'students',
			storeId: 'students'
		},
		judges: {
			type: 'judges',
			storeId: 'judges'
		},
		projects: {
			type: 'projects',
			storeId: 'projects'
		},
		locations: {
			type: 'locations',
			storeId: 'locations'
		}
        ,
        grades: {
			type: 'studentGrades',
			storeId: 'studentGrades',
            listeners: {
				load: 'loadStudentsGrades'
			}
		},
        studentgradesview: {
			type: 'studentgradesview',
			storeId: 'studentgradesview'//,
            // listeners: {
			// 	load: 'loadStudentsGrades'
			// }
		},
        judgesgrades: {
			type: 'judgesgrades',
			storeId: 'judgesgrades'//,
            // listeners: {
			// 	load: 'loadStudentsGrades'
			// }
		}
	}
});

module.exports = function(sequelize, DataTypes) {
	var student_grade = sequelize.define('student_grade', {
        studentId: DataTypes.INTEGER,
        termId: DataTypes.INTEGER,
        state: DataTypes.STRING,
		abbr: DataTypes.STRING,
		fullName: DataTypes.STRING,
        grade_display: DataTypes.STRING,
        project: DataTypes.STRING,
		grade: DataTypes.DECIMAL,
		max: DataTypes.DECIMAL,
        accepted: DataTypes.BOOLEAN,
        pending: DataTypes.BOOLEAN,
        rejected: DataTypes.BOOLEAN,
	}, {
		timestamps: false,
		tableName: 'student_grades_detailed',
		classMethods: {
			associate: function () {
                console.log("hello ",student_grade);
				student_grade.removeAttribute('id');
			}
		}
	});
    
	return student_grade;
};
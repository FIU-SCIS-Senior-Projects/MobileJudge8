module.exports = function(sequelize, DataTypes) {
	var student_grade = sequelize.define('student_grade', {
        studentId: DataTypes.INTEGER,
        state: DataTypes.STRING,
		abbr: DataTypes.STRING,
        termId: DataTypes.INTEGER,
		fullName: DataTypes.STRING,
        grade_display: DataTypes.STRING,
        project: DataTypes.STRING,
        gradeStatus: DataTypes.STRING,
		grade: DataTypes.DECIMAL,
		max: DataTypes.DECIMAL,
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
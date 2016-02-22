module.exports = function(sequelize, DataTypes) {
	var judges_grade = sequelize.define('judges_grade', {
        judge: DataTypes.STRING,
        student: DataTypes.STRING,
		question: DataTypes.STRING,
        grade: DataTypes.INTEGER,
        projectName: DataTypes.STRING,
        comment: DataTypes.STRING,
		accepted: DataTypes.STRING,
	}, {
		timestamps: false,
		tableName: 'judges_grades',
		classMethods: {
			associate: function () {
                console.log("hello ",judges_grade);
				judges_grade.removeAttribute('id');
			}
		}
	}
    );
	return judges_grade;
};
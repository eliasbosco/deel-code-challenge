const { Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    class Contract extends Model {
        static associate(models) {
            Contract.belongsTo(models.Profile, {
                as: 'Contractor'
            })
            Contract.belongsTo(models.Profile, {
                as: 'Client'
            })
            Contract.hasMany(models.Job)
        }
    }
    Contract.init(
        {
            terms: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            status:{
                type: DataTypes.ENUM('new','in_progress','terminated')
            }
        },
        {
            sequelize,
            modelName: 'Contract'
        }
    );

    return Contract
}
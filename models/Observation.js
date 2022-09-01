const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Observation extends Model {}

Observation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        observation_text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3]
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        entry_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'entry',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'observation'
    }
);

module.exports = Observation;
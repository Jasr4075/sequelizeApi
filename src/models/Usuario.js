import { DataTypes } from "sequelize";
import { sequelize } from "../config/config";


const Usuario = sequelize.define(
    'usuarios',
    {
        id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
        nome: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        cpfcnpj:{
            type: DataTypes.STRING(18),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        telefone: {
            type: DataTypes.STRING(18),
            allowNull: false
        }
    },

    
    {
        freezeTableName: true,
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at'
    }

)


export default Usuario;
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const VisitanteP = sequelize.define('VisitanteP', {
    diaIngreso: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    nombreVisitante: { type: DataTypes.STRING, allowNull: false },
    visitanteDocumento: { type: DataTypes.STRING, allowNull: false },
    destino: { type: DataTypes.STRING, allowNull: false },
    nombreAutoriza: { type: DataTypes.STRING, allowNull: false },
    idConjunto: { type: DataTypes.STRING, allowNull: false }
})


module.exports = VisitanteP
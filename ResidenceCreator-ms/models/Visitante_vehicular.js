const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const VisitanteV = sequelize.define('VisitanteV', {
    diaIngreso: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    nombreVisitante: { type: DataTypes.STRING, allowNull: false },
    visitanteDocumento: { type: DataTypes.STRING, allowNull: false },
    destino: { type: DataTypes.STRING, allowNull: false },
    nombreAutoriza: { type: DataTypes.STRING, allowNull: false },
    placaVehiculo: { type: DataTypes.STRING, allowNull: false },
    tipoVehiculo: { type: DataTypes.STRING, allowNull: false },
    espacioAsignado: { type: DataTypes.INTEGER, allowNull: false },
    salidaVehiculo: { type: DataTypes.DATE, allowNull: true },
    idConjunto: { type: DataTypes.STRING, allowNull: false }
})


module.exports = VisitanteV
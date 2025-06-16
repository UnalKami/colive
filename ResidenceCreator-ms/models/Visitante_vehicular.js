const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const VisitanteV = sequelize.define('VisitanteV', {
    diaIngreso: {type: DataTypes.DATE, allowNull: false},
    nombreVisitante: {type: DataTypes.STRING, allowNull: false},
    visitanteDocumento: {type: DataTypes.STRING, allowNull:false},
    Destino: {type: DataTypes.STRING, allowNull: false},
    nombreAutoriza: {type: DataTypes.STRING, allowNull: false},

    placaVehiculo: {type: DataTypes.STRING, allowNull:false},
    tipoVehiculo: { type: DataTypes.STRING, allowNUll: false},
    espacioAsignado: {type: DataTypes.INTEGER, allowNUll: false},
    salidaVehiculo: { type: DataTypes.DATE, default: null},
    idConjunto: {type: DataTypes.UUID, allowNull: false}
})


module.exports = VisitanteV
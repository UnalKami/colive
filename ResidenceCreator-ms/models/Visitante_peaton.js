const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const VisitanteP = sequelize.define('VisitanteP', {
    diaIngreso: {type: DataTypes.DATE, allowNull: false},
    nombreVisitante: {type: DataTypes.STRING, allowNull: false},
    visitanteDocumento: {type: DataTypes.STRING, allowNull:false},
    Destino: {type: DataTypes.STRING, allowNull: false},
    nombreAutoriza: {type: DataTypes.STRING, allowNull: false},
    idConjunto: {type: DataTypes.UUID, allowNull: false}
})


module.exports = VisitanteP
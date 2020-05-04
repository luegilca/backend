//import models
const User = require('../models/User');
const Employee = require('../models/Employee');
const Role = require('../models/Role');
const City = require('../models/City');
const Country = require('../models/Country');
const Location = require('../models/Location')
const Modality = require('../models/Modality')


module.exports = async () =>{
    //create the relations
    // User <- Employee
    Employee.belongsTo(User,{as:"UserEmployee",foreignKey:"employeeUser"});
    User.hasMany(Employee,{as:"UserEmployee",foreignKey:"employeeUser"});
    // Employee -> Role
    Employee.belongsTo(Role,{as:"RoleEmployee",foreignKey:"employeeRole"});
    Role.hasMany(Employee,{as:"RoleEmployee",foreignKey:"employeeRole"})
    //Countru <- City
    City.belongsTo(Country,{as:"CityCountry",foreignKey:"cityCountry"});
    Country.hasMany(City,{as:"Cities",foreignKey:"cityCountry"});
    //location -> City
    Location.belongsTo(City,{as:"LocationCity",foreignKey:"locationCity"});
    City.hasMany(Location,{as:"locations",foreignKey:"locationCity"});
};


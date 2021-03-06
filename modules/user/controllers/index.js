const UserModel = require('../../../models/User');
const EmployeeModel = require('../../../models/Employee');
const RoleModel = require('../../../models/Role')
const auth = require('../../auth');
const logger = require('../../../lib/logger')
const util = require('../../util')

//register method
module.exports.register = async (req, res) => {
    try {
        const data = req.body;
        util.validateRegister(data);
        data.password = util.hashPassword(data.password);
        await UserModel.create(data);

        res.json({
            success: true,
            message: 'user successfully created'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const validateRegister = (dataForm) => {
    if (!dataForm.username || dataForm.username === '') {
        throw new Error('name parameter is required');
    }
    if (!dataForm.email || dataForm.email === '') {
        throw new Error('email parameter is required');
    }
    if (!dataForm.password) {
        throw new Error('password parameter is required');
    }
    if (dataForm.password.length < 6) {
        throw new Error('password must have more than 5 characters');
    }
}

module.exports.login = async (req, res) => {
    try {
        const data = req.body;
        let {email, password} = data;
        let user = await UserModel.findOne({where: {email}});

        if (user === null || !util.comparePassword(user.password,password) ) {
            throw new Error("User or Password are wrong");
        }
         else {
            let {
                username,
                emaila,
                id
            } = user;
            let EmployeeRole = await EmployeeModel.findOne(
                {
                    include: [
                        {
                            model: UserModel,
                            as: "UserEmployee"
                        },
                        {
                            model: RoleModel,
                            as: "RoleEmployee"
                        }
                    ],
                    where: {"employeeUser":id},
                    attributes: [`RoleEmployee.roleName`]
                });
                let role = EmployeeRole ? EmployeeRole["RoleEmployee"]["roleName"]:null;
                let token = auth.createToken({username,id});
                res.json({
                    success: true,
                    token,
                    role,
                    username,
                    email: emaila
                });
        }
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        });
    }
}

module.exports.checkToken = async (req, res) => {
    try {
        const data = req.body;
        let {token} = data;
        let username = await auth.getUsernameFromToken(token);
        res.json({
            success: true,
            username
        })
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        });
    }
}


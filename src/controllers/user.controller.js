const { User, UserRole, Role } = require("../models");

const UserController = () => {
  const getAll = async (req, res, next) => {
    const users = await User.findAll({
      include: UserRole,
    });
    return res.status(200).send(users);
  };

  const getMe = async (req, res) => {
    let roles = await req.user.getRoles();
    roles = roles.map((role) => role.name);

    const user = await User.findByPk(req.user.id, {
      include: Role,
    });
    return res.status(200).send([user, roles]);
  };

  const getRoles = async (req, res) => {
    const roles = await Role.findAll({
      include: User,
    });
    return res.status(200).send(roles);
  };

  const getUserRoles = async (req, res) => {
    const roles = await UserRole.findAll({
      include: [Role, User],
    });
    return res.status(200).send(roles);
  };

  return {
    getAll,
    getMe,
    getRoles,
    getUserRoles,
  };
};

module.exports = UserController;

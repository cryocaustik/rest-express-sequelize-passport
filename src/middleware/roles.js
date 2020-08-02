/**
 * Verify if authorized user has the required role to access route
 * @param {Array} allowedRoles Array of role names
 */
const roles = (allowedRoles) => {
  allowedRoles = allowedRoles.map((r) => r.toLowerCase());

  return async (req, res, next) => {
    const userRoles = await req.user.getRoles();

    if (!userRoles) {
      return res.status(403).send("no roles found");
    }

    const hasRole = userRoles.some((role) =>
      allowedRoles.includes(role.name.toLowerCase())
    );
    if (!hasRole) {
      return res.status(403).send("missing/invalid role(s)");
    }

    req.user.roles = userRoles;
    next();
  };
};

module.exports = roles;

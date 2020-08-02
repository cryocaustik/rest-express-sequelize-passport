const { User, RefreshToken } = require("../models");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const AuthController = () => {
  /**
   * Generates JWT Token using a User instance
   * @param {*} user models.User instance
   */
  const generateToken = async (user) => {
    const refreshToken = await generateRefreshToken(user);
    return jwt.sign(
      {
        data: {
          id: user.id,
          username: user.username,
          refreshToken: refreshToken,
        },
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
  };

  /**
   * Generates JWT Refresh Token using a User Instance, removing any previous refresh tokens
   * @param {*} user models.User istance
   */
  const generateRefreshToken = async (user) => {
    // delete any existing refresh tokens
    RefreshToken.destroy({
      where: {
        userId: user.id,
      },
    });

    // generate and store new token
    const token = await RefreshToken.create({
      userId: user.id,
      token: jwt.sign(
        {
          data: {
            userId: user.id,
          },
        },
        process.env.TOKEN_SECRET
      ),
    });

    // return refresh token only
    return token.token;
  };

  /**
   * User Authentication Controller
   * @param {*} req Express HTTP Request
   * @param {*} res Express HTTP Response
   */
  const authenticate = async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;

      // verify required data is passed, 403 on missing any
      if (!username || !password) {
        return res.status(403).send("invalid username or password");
      }

      const user = await User.scope("withPassword").findOne({
        where: {
          username: username,
        },
      });

      // 403 if user does not exist
      if (!user) {
        return res.status(403).send("invalid username or password");
      }

      // 403 on invalid password
      if (!(await user.validPassword(password))) {
        return res.status(403).send("invalid password");
      }

      // update user login date
      user.update({
        lastLogin: new Date(),
      });

      // create new token and return
      const token = await generateToken(user);
      res.json(token);
    } catch (err) {
      return res.status(500).send("authentication failed");
    }
  };

  /**
   * User Registration Controller
   * @param {*} req Express HTTP Request
   * @param {*} res Express HTTP Response
   */
  const register = async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const email = req.body.email;

      // verify required data is passed, 403 on missing any
      if (!username || !password || !email) {
        return res.status(403).send("invalid username or password");
      }

      // check if username already exists, 403 on existing username
      let user = await User.findOne({
        where: {
          username: username,
        },
      });
      if (user) {
        return res.status(403).send("username already exists");
      }

      // else create user
      user = await User.create({
        username: username,
        password: password,
        email: email,
        lastLogin: moment(),
        createdAt: moment(),
        updatedAt: moment(),
      });

      // return jwt token
      const token = await generateToken(user);
      return res.json(token);
    } catch (err) {
      return res.status(500).send("registration failed");
    }
  };

  /**
   * Password Update Controller
   * @param {*} req Server HTTP Request
   * @param {*} res Server HTTP Response
   */
  const updatePassword = async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const new_password = req.body.new_password;

      // 403 if data elements are missing
      if (!username || !password || !new_password) {
        return res
          .status(403)
          .send("invalid username, password, or new_password");
      }

      // check if user exists
      let user = await User.scope("withPassword").findOne({
        where: {
          username: username,
        },
      });

      // 403 if username not found
      if (!user) {
        return res.status(403).send("invalid username");
      }

      // 403 if pwd change not for authed usr and req user is not admin
      if (
        req.user.id !== user.id &&
        !req.user.roles.some((role) =>
          ["superuser", "administrator"].includes(role.name.toLowerCase())
        )
      ) {
        return res.status(403).send("unauthorized");
      }

      // 403 if invalid password
      if (!(await user.validPassword(password))) {
        return res.status(403).send("invalid password");
      }

      // set new password, 500 if fails
      const response = await user.update({ password: new_password });
      if (!response) {
        return res.status(500).send("password update failed");
      }

      return res.status(202).send(["password updated"]);
    } catch (err) {
      return res.status(500).send("password update failed");
    }
  };

  /**
   * Verifies given refreshToken and returns new auth token
   * @param {*} req Express HTTP Request
   * @param {*} res Express HTTP Response
   */
  const refreshToken = async (req, res) => {
    const rawToken = req.body.refreshToken;

    // 403 on missing token
    if (!rawToken) {
      return res.status(403).send("invalid/missing refresh token");
    }

    // verify refresh token is valid
    let verifiedToken;
    try {
      verifiedToken = jwt.verify(rawToken, process.env.TOKEN_SECRET);
    } catch (err) {
      return res.status(403).send("invalid/missing refresh token");
    }

    // look up token using userId and rawToken
    const dbToken = await RefreshToken.findOne({
      where: {
        userId: verifiedToken.data.userId,
        token: rawToken,
      },
      include: User,
    });

    // 403 if dbToken not found
    if (!dbToken) {
      return res.status(403).send("invalid/missing refresh token");
    }

    // 403 if dbToken is expired
    if (moment(dbToken.expiresAt) >= moment()) {
      return res.status(403).send("expired refresh token");
    }

    // generate new auth token, which will also wipe and generate a new refresh token
    const newAuthToken = await generateToken(dbToken.User);
    return res.json(newAuthToken);
  };

  // return usable controllers
  return {
    authenticate,
    register,
    updatePassword,
    refreshToken,
  };
};

module.exports = AuthController;

"use strict";
const bcrypt = require("bcryptjs");
const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const users = [
      {
        username: "dev1",
        email: "dev1@dev.com",
        password: await hashPassword("dev1"),
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "dev2",
        email: "dev2@dev.com",
        password: await hashPassword("dev2"),
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "dev3",
        email: "dev3@dev.com",
        password: await hashPassword("dev3"),
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Users", users, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};

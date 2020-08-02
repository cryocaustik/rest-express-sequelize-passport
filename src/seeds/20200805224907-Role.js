"use strict";

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
    await queryInterface.bulkInsert("Roles", [
      {
        name: "Superuser",
        description: "site owner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Admin",
        description: "Administrator",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User",
        description: "normal user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Role", null, {});
  },
};

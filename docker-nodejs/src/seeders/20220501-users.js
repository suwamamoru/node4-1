'use strict';

const db = require('../models/');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          username: 'user1',
          email: 'user1@example.com',
          password: 'aaaaaaa',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'user2',
          email: 'user2@example.com',
          password: 'bbbbbbb',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'user3',
          email: 'user3@example.com',
          password: 'ccccccc',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'user4',
          email: 'user4@example.com',
          password: 'ddddddd',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
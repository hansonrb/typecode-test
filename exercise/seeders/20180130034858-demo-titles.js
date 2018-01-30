'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Articles',
      [
        {
          title: 'It is impossible to walk rapidly and be unhappy.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "We don't get offered crises, they arrive.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "I have seen the future and it doesn't work.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "I have seen the future and it doesn't work.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'I dwell in possibility...',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Knowledge is power.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Articles', null, {});
  },
};

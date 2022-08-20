const listHelper = require('../utils/list_helper');

test('dummy returns 1', () => {
  const blogs = [];

  expect(listHelper(blogs)).toBe(1);
});

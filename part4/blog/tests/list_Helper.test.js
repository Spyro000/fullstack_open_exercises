const listHelper = require('../utils/list_helper');
const blogs = require('./test_blogs');

// dummy tests
test('dummy returns 1', () => {
  const empty = [];

  expect(listHelper.dummy(empty)).toBe(1);
});

// totalLikes tests
describe('total likes', () => {
  test(
    'of empty list is zero',
    () => expect(listHelper.totalLikes([])).toBe(0),
  );
  test(
    'when list has only one blog equals of that',
    () => expect(listHelper.totalLikes([blogs[0]])).toBe(7),
  );
  test(
    'of a bigger list is calculated right',
    () => expect(listHelper.totalLikes(blogs)).toBe(36),
  );
});

// favoriteBlog tests

describe('favorite blog', () => {
  test(
    'choose blog with the most likes in array',
    () => expect(listHelper.favoriteBlog(blogs)).toBe(blogs[2]),
  );
});

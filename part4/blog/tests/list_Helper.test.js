const { dummy, totalLikes } = require('../utils/list_helper');
const blogs = require('./test_blogs');

test('dummy returns 1', () => {
  const empty = [];

  expect(dummy(empty)).toBe(1);
});

describe('total likes', () => {
  test(
    'of empty list is zero',
    () => expect(totalLikes([])).toBe(0),
  );
  test(
    'when list has only one blog equals of that',
    () => expect(totalLikes([blogs[0]])).toBe(7),
  );
  test(
    'of a bigger list is calculated right',
    () => expect(totalLikes(blogs)).toBe(36),
  );
});

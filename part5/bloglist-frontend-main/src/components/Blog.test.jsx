import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    likes: 25,
    url: 'https://test.url',
  };
  const onAddLike = jest.fn();
  const onRemoveBlog = jest.fn();

  const setupRender = () => render(
    <Blog blog={blog} onAddLike={onAddLike} onRemoveBlog={onRemoveBlog} />,
  );

  test('by default renders title and author but not likes or url', async () => {
    setupRender();

    const title = await screen.findByText(blog.title);
    expect(title).toBeVisible();

    const author = await screen.findByText(blog.author);
    expect(author).toBeVisible();

    const likes = await screen.findByText(blog.likes);
    expect(likes).not.toBeVisible();

    const url = await screen.findByText(blog.url);
    expect(url).not.toBeVisible();
  });
});

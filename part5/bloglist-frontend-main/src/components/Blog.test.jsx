import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  test('render shows url and likes after show button pressed', async () => {
    setupRender();
    const user = userEvent.setup();
    const button = screen.getByText('view');

    await user.click(button);

    const likes = await screen.findByText(blog.likes);
    expect(likes).toBeVisible();

    const url = await screen.findByText(blog.url);
    expect(url).toBeVisible();
  });

  test('when like button clicked twice it call event handler twice', async () => {
    setupRender();
    const user = userEvent.setup();
    const button = screen.getByText('like');

    await user.click(button);
    await user.click(button);

    expect(onAddLike.mock.calls).toHaveLength(2);
  });
});

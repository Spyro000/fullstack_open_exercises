import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewBlogForm from './NewBlogForm';

describe('<NewBlogForm />', () => {
  const onSubmit = jest.fn();

  const setupRender = () => render(
    <NewBlogForm onSubmit={onSubmit} />,
  );

  test('by default renders title and author but not likes or url', async () => {
    setupRender();
    const user = userEvent.setup();
    const inputs = {
      title: 'Test title',
      author: 'Test author',
      url: 'http://test.url',
    };

    const title = await screen.findByPlaceholderText('Title');
    await user.type(title, inputs.title);

    const author = await screen.findByPlaceholderText('Author');
    await user.type(author, inputs.author);

    const url = await screen.findByPlaceholderText('Url');
    await user.type(url, inputs.url);

    const submit = await screen.findByRole('button');
    await user.click(submit);

    expect(onSubmit.mock.calls).toHaveLength(1);
    expect(onSubmit.mock.calls[0][0]).toStrictEqual(inputs);
  });
});

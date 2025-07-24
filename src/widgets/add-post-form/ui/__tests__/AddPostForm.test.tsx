// import { render, screen } from '@testing-library/react';

// import { User } from '@/entities/user/model/user.types';

// import { usePostForm } from '../../lib/usePostForm';
// import { AddPostForm } from '../AddPostForm';

// jest.mock('../../lib/usePostForm');

// const mockUsePostForm = usePostForm as jest.MockedFunction<typeof usePostForm>;

// const user: User = {
//   id: '123',
//   name: 'John Doe',
//   avatar_url: '/test-avatar.png',
//   email: 'john@example.com',
//   bio: '',
//   banner_url: null,
//   created_at: '',
//   date_of_birth: null,
//   followers_count: 0,
//   following_count: 0,
//   gender: null,
//   phone_number: null,
//   updated_at: null,
//   user_telegram: null,
// };

// describe('AddPostForm', () => {
//   beforeEach(() => {
//     mockUsePostForm.mockReturnValue({
//       handleSubmit: jest.fn((cb) => {
//         return async (e?: React.BaseSyntheticEvent) => {
//           e?.preventDefault?.();
//           await Promise.resolve(cb({ content: '' }));
//         };
//       }),
//       onSubmit: jest.fn(),
//       register: jest.fn(() => ({
//         name: 'content',
//         ref: jest.fn(),
//         onBlur: jest.fn(),
//         onChange: jest.fn(),
//       })),
//       watch: jest.fn((field?: string) =>
//         field === 'content' ? 'Test post' : '',
//       ),
//       removeImage: jest.fn(),
//       handleChange: jest.fn(),
//       previewItems: [],
//       previews: [],
//       imagesSize: '1',
//       isSubmitting: false,
//       imageError: '',
//       errors: {},
//       isUploading: false,
//       uploadProgress: 0,
//     });
//   });

//   it('renders form with user avatar and textarea', () => {
//     render(<AddPostForm user={user} />);
//     expect(screen.getByAltText('avatar')).toBeInTheDocument();
//     expect(
//       screen.getByPlaceholderText('What is happening?!'),
//     ).toBeInTheDocument();
//   });

//   it('displays character counter correctly', () => {
//     render(<AddPostForm user={user} />);
//     expect(screen.getByText(/11\/280/)).toBeInTheDocument();
//   });

//   it('shows image size info', () => {
//     render(<AddPostForm user={user} />);
//     expect(screen.getByText('(1MB/3MB per image)')).toBeInTheDocument();
//   });

//   it('shows content validation error', () => {
//     mockUsePostForm.mockReturnValueOnce({
//       ...mockUsePostForm(user as never),
//       errors: { content: { message: 'Required field', type: 'required' } },
//     });
//     render(<AddPostForm user={user} />);
//     expect(screen.getByText('Required field')).toBeInTheDocument();
//   });

//   it('shows image upload error', () => {
//     mockUsePostForm.mockReturnValueOnce({
//       ...mockUsePostForm(user as never),
//       imageError: 'Image too large',
//     });
//     render(<AddPostForm user={user} />);
//     expect(screen.getByText('Image too large')).toBeInTheDocument();
//   });

//   it('disables submit button when isSubmitting is true', () => {
//     mockUsePostForm.mockReturnValueOnce({
//       ...mockUsePostForm(user as never),
//       isSubmitting: true,
//     });
//     render(<AddPostForm user={user} />);
//     expect(screen.getByRole('button')).toBeDisabled();
//   });

//   it('shows progress bar during upload', () => {
//     mockUsePostForm.mockReturnValueOnce({
//       ...mockUsePostForm(user as never),
//       isUploading: true,
//       uploadProgress: 42,
//     });
//     render(<AddPostForm user={user} />);
//     expect(screen.getByRole('progressbar')).toBeInTheDocument();
//   });

//   it('returns null when no user provided', () => {
//     const { container } = render(
//       <AddPostForm user={null as unknown as User} />,
//     );
//     expect(container.firstChild).toBeNull();
//   });
// });

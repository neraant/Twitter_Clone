export const routes = {
  root: '/',
  auth: {
    signUpMain: '/welcome',
    signUp: '/register',
    login: '/login',
    error: '/error',
  },
  api: {
    callback: '/auth/callback',
    checkEmail: '/auth/check-email',
    createPost: '/posts/create',
    getUser: '/users',
  },
  app: {
    home: '/home',
    explore: '/explore',
    notifications: '/notifications',
    messages: '/messages',
    bookmarks: '/bookmarks',
    lists: '/lists',
    profile: '/profile',
    more: '/more',
  },
};

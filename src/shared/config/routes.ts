export const routes = {
  root: '/',
  auth: {
    signUpMain: '/welcome',
    signUp: '/register',
    login: '/login',
  },
  api: {
    callback: '/auth/callback',
    checkEmail: '/auth/check-email',
    getTweets: '/posts',
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

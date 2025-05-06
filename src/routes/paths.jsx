export const rootPaths = {
  root: '/lehannhat.github.io/',
  pagesRoot: 'pages',
  authRoot: '/lehannhat.github.io/authentication',
  productRoot: '/lehannhat.github.io/product',
  profileRoot: '/lehannhat.github.io/user',
};

export default {
  signin: `${rootPaths.authRoot}/signIn`,
  signup: `${rootPaths.authRoot}/signUp`,
  verify: `${rootPaths.authRoot}/verify`,
  forgotPassword: `${rootPaths.authRoot}/forgot_password`,
  resetPassword: `${rootPaths.authRoot}/reset_password`,
  getall:`${rootPaths.productRoot}/all`,
  getproduct:`${rootPaths.productRoot}/:id`,
  getCartDetail:`${rootPaths.productRoot}/cart_detail`,
  getOrder:`${rootPaths.productRoot}/order`,
  getprofile:`${rootPaths.profileRoot}/info`,
  getCart:`${rootPaths.profileRoot}/cart`,
  getTracking:`${rootPaths.profileRoot}/tracking-order`,
 
};
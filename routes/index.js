const tokenUtils =  require("../utils/token-utils");

const router = require('express').Router();
const OAuthServer = require('express-oauth-server');
const OAuthModel = require('../config/models');

let oauth = new OAuthServer({
  model: OAuthModel,
  useErrorHandler: true,
  debug: true,
  accessTokenLifetime: 2 * 60 * 60 // hours * minutes * secondes
});

router.use(require('./oauth'));
router.use(require('./public'));
router.use('/account', oauth.authenticate(), (req, res) => {
  return res.json(res.locals.oauth.token.user);
});
router.use('/secured/profile', oauth.authenticate(), (req, res) => {
  console.log(res.locals)
  return res.render('secured', { token: JSON.stringify(res.locals) });
});
router.use('/secured/admin_profile', oauth.authenticate(), (req, res) => {
  console.log(res.locals)
  const isAuthorize = tokenUtils.scopeValidator(res.locals, 'scp_admin')
  console.log(res.locals.oauth.token.user.username, isAuthorize ? 'can' : 'can\'t', 'go through theses data')
  return res.render('secured', { token: JSON.stringify(res.locals) });
});

module.exports = router;

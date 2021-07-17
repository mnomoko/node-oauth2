
function scopeValidator(header, scope) {
  return getScopeFromOAuth(header) === scope && scope != null;
}

function getScopeFromOAuth(data) {
  let scope = undefined;
  if (data != null && data.oauth != null && data.oauth.token != null && data.oauth.token.scope != null) {
    scope = data.oauth.token.scope;
  }
  return scope;
}
module.exports = {
  scopeValidator: scopeValidator,
  getScopeFromOAuth: getScopeFromOAuth,
}

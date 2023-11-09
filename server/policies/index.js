module.exports = {
  checkConfigRoles(policyContext, _, { strapi }) {
    const configRoles = ['']; // read the roles from the config file
    const userRoles = policyContext.state.user.roles;
    const hasRole = userRoles.find((r) => configRoles.includes(r.code));
    if (hasRole) {
      return true;
    }
    return false;
  },
};
const { AsyncLocalStorage } = require('async_hooks');
const tenantStorage = new AsyncLocalStorage();

const tenantMiddleware = (req, res, next) => {
    // req.user.schoolId should be set by the verifyToken middleware
    const schoolId = req.user?.schoolId;
    if (schoolId) {
        tenantStorage.run(schoolId, () => {
            next();
        });
    } else {
        // If no schoolId (e.g. Platform Admin or unauthenticated), run without it
        tenantStorage.run(null, () => {
            next();
        });
    }
};

module.exports = { tenantStorage, tenantMiddleware };

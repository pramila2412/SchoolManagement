const { tenantStorage } = require('../../middleware/tenant');

module.exports = function tenantPlugin(schema, options) {
    if ((options && options.skipTenant) || (schema.options && schema.options.skipTenant)) return;

    schema.add({ schoolId: { type: String, index: true } });

    const injectTenant = function(next) {
        const schoolId = tenantStorage.getStore();
        console.log("injectTenant called with schoolId:", schoolId);
        if (schoolId) {
            this.where({ schoolId });
        }
        next();
    };

    schema.pre('find', injectTenant);
    schema.pre('findOne', injectTenant);
    schema.pre('count', injectTenant);
    schema.pre('countDocuments', injectTenant);
    schema.pre('findOneAndUpdate', injectTenant);
    schema.pre('updateMany', injectTenant);
    schema.pre('updateOne', injectTenant);

    schema.pre('aggregate', function(next) {
        const schoolId = tenantStorage.getStore();
        if (schoolId) {
            this.pipeline().unshift({ $match: { schoolId } });
        }
        next();
    });

    schema.pre('save', function(next) {
        const schoolId = tenantStorage.getStore();
        if (schoolId && !this.schoolId) {
            this.schoolId = schoolId;
        }
        next();
    });
};

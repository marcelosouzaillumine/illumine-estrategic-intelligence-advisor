export class TenantRepository {
    persistence;
    constructor(persistence) {
        this.persistence = persistence;
    }
    async getTenantById(tenantId) {
        return this.persistence.getTenantById(tenantId);
    }
    async getTenantsByOwnerId(ownerId) {
        return this.persistence.getTenantsByOwnerId(ownerId);
    }
    async createTenant(tenant) {
        return this.persistence.createTenant(tenant);
    }
    async updateTenant(tenantId, payload) {
        return this.persistence.updateTenant(tenantId, payload);
    }
    async deleteTenant(tenantId) {
        return this.persistence.deleteTenant(tenantId);
    }
    async getMembershipsByUserId(userId) {
        return this.persistence.getMembershipsByUserId(userId);
    }
    async getMembershipsByTenantId(tenantId) {
        return this.persistence.getMembershipsByTenantId(tenantId);
    }
    async createMembership(membership) {
        return this.persistence.createMembership(membership);
    }
    async updateMembership(membershipId, payload) {
        return this.persistence.updateMembership(membershipId, payload);
    }
    async removeMembership(membershipId) {
        return this.persistence.removeMembership(membershipId);
    }
}

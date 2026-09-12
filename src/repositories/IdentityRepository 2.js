export class IdentityRepository {
    persistence;
    constructor(persistence) {
        this.persistence = persistence;
    }
    async getUserByAuthUid(uid) {
        return this.persistence.getUserByAuthUid(uid);
    }
    async getUserByEmail(email) {
        return this.persistence.getUserByEmail(email);
    }
    async createUser(user) {
        return this.persistence.createUser(user);
    }
    async updateUserStatus(userId, status) {
        return this.persistence.updateUserStatus(userId, status);
    }
    async getUserProfile(userId) {
        return this.persistence.getUserProfile(userId);
    }
    async saveUserProfile(profile) {
        return this.persistence.saveUserProfile(profile);
    }
    async createSession(session) {
        return this.persistence.createSession(session);
    }
    async revokeSession(sessionId) {
        return this.persistence.revokeSession(sessionId);
    }
}

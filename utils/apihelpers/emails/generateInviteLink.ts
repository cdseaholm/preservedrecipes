import crypto from 'crypto';

export async function GenerateInvite() {
    const inviteTokenCreated = crypto.randomBytes(20).toString('hex');
    return inviteTokenCreated;
}
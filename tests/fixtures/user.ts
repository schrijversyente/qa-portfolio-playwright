import { APIRequestContext } from '@playwright/test';
import { ADMIN } from '../data/users';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:8091';

export async function getAdminAccessToken(request: APIRequestContext): Promise<string> {
    const response = await request.post(`${API_BASE_URL}/users/login`, {
        data: { email: ADMIN.email, password: ADMIN.password },
    });
    if (!response.ok()) {
        throw new Error(`Failed to log in as admin: ${response.status()} - ${await response.text()}`);
    }
    const { access_token } = await response.json();
    return access_token;
}

export async function seedUser(
    request: APIRequestContext
): Promise<{ id: string; email: string; password: string; name: string }> {
    const email = `user-${crypto.randomUUID()}@test.com`;
    const password = 'Xk9#mQ2vLp7z!';
    const firstName = 'test';
    const lastName = 'test';

    const response = await request.post(`${API_BASE_URL}/users/register`, {
        data: {
            first_name: firstName,
            last_name: lastName,
            address: {
                street: '123 Test St',
                house_number: '1',
                city: 'Testville',
                state: 'TS',
                country: 'Testland',
                postal_code: '12345',
            },
            phone: '123-456-7890',
            dob: '1990-01-01',
            password: password,
            email: email,
        },
    });
    if ((response.status() !== 201)) {
        throw new Error(`Failed to seed user: ${response.status()} - ${await response.text()}`);
    }
    const { id } = await response.json();
    return { id, email, password, name: `${firstName} ${lastName}` };
}

export async function deleteUser(request: APIRequestContext, id: string, adminAccessToken: string): Promise<void> {
    const response = await request.delete(`${API_BASE_URL}/users/${id}`, {
        headers: {
            Authorization: `Bearer ${adminAccessToken}`,
        },
    });
    if (response.status() !== 204) {
        throw new Error(`Failed to delete user: ${response.status()} - ${await response.text()}`);
    }
}

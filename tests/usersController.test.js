const supertest = require('supertest');
const { set } = require('../src/app');
const app = require('../src/app');
const pool = require('../src/database/DB_config');

async function cleanDataBase() {
    await pool.query('DELETE FROM users');
    await pool.query('DELETE FROM sessions');
    await pool.query('DELETE FROM records');
}

beforeAll(cleanDataBase);
afterAll(async () => {
    await cleanDataBase();
    pool.end();
});

describe('POST /sign-up', () => {
    it('should return status 201 when data is valid', async () => {
        const body = {
            name: 'Fulano',
            email:'fulano@fulano.com',
            password: 'dahoralek123',
            passwordConfirmation: 'dahoralek123'
        }
        const response = await supertest(app).post('/api/users/sign-up').send(body);
        expect(response.status).toBe(201);
    })

    it('should return status 409 when email is duplicated', async () => {
        const body = {
            name: 'Fulano',
            email:'fulano@fulano.com',
            password: 'dahoralek123',
            passwordConfirmation: 'dahoralek123'
        }
        const response = await supertest(app).post('/api/users/sign-up').send(body);
        expect(response.status).toBe(409);
    })

    it('should return 422 when data is invalid', async () => {
        const body = {
            name: 'Fulano1',
            email:'fulano@fulano0.com',
            password: 'dahoralek123',
            passwordConfirmation: 'dahoralek123'
        }
        const response = await supertest(app).post('/api/users/sign-up').send(body);
        expect(response.status).toBe(422);
    })
})

describe('POST /sign-in', () => {
    it('should return 422 when data is invalid', async () => {
        const body = {
            // email:'fulano@fulano.com',
            password: 'dahoralek123',
        }
        const response = await supertest(app).post('/api/users/sign-in').send(body);
        expect(response.status).toBe(422);
    })

    it('should return 401 when password or email is wrong', async () => {
        const body = {
            email:'fulano@fulano.com',
            password: 'dahoralek12',
        }
        const response = await supertest(app).post('/api/users/sign-in').send(body);
        expect(response.status).toBe(401);
    })

    it('should return user info when data is valid', async () => {
        const body = {
            email:'fulano@fulano.com',
            password: 'dahoralek123',
        }
        const response = await supertest(app).post('/api/users/sign-in').send(body);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            name: 'Fulano',
            email:'fulano@fulano.com',
            id:response.body.id,
            token:response.body.token
        })
    })    
})

describe('POST /sign-out', () => {
    it('should return 200 when authorized', async () => {
        const body = {
            email:'fulano@fulano.com',
            password: 'dahoralek123',
        }
        const response = await supertest(app).post('/api/users/sign-in').send(body);

        const response2 = await supertest(app).post('/api/users/sign-out').set({Authorization:`Bearer ${response.body.token}`});
        expect(response2.status).toBe(200);        
    })

    it('should return 401 when header is missing', async () => {
        const response2 = await supertest(app).post('/api/users/sign-out');
        expect(response2.status).toBe(401);
    })

    it('should return 401 when token invalid', async () => {
        const body = {
            email:'fulano@fulano.com',
            password: 'dahoralek123',
        }
        const response = await supertest(app).post('/api/users/sign-in').send(body);

        const response2 = await supertest(app).post('/api/users/sign-out').set({Authorization:`Bearer ${1}`});
        expect(response2.status).toBe(401);
    })
})

describe('POST /records', () => {
    it('should return 422 when data is invalid', async () => {
        const body = {
            email:'fulano@fulano.com',
            password: 'dahoralek123',
        }
        const response = await supertest(app).post('/api/users/sign-in').send(body);

        const body2 = {
            transaction: '23,40',
            description: 'iFood',
            type: 'expense'
        }
        const response2 = await supertest(app).post('/api/records').send(body2).set({Authorization:`Bearer ${response.body.token}`});;
        
        expect(response2.status).toBe(422);
    })

    it('should return 200 and the record when data is valid', async () => {
        const body = {
            email:'fulano@fulano.com',
            password: 'dahoralek123',
        }
        const response = await supertest(app).post('/api/users/sign-in').send(body);

        const body2 = {
            transaction: '23.40',
            description: 'iFood',
            type: 'expense'
        }

        const response2 = await supertest(app).post('/api/records').send(body2).set({Authorization:`Bearer ${response.body.token}`});
        expect(response2.status).toBe(201);
        expect(response2.body).toMatchObject({
            transaction: 'R$ 23,40',
            description: 'iFood',
            type: 'expense',
            date: response2.body.date,
            userId: response.body.id
        })
    })
})

describe('GET /records', () => {
    it('should return the first record inserted', async () => {
        const body = {
            email:'fulano@fulano.com',
            password: 'dahoralek123',
        }
        const response = await supertest(app).post('/api/users/sign-in').send(body);

        const response2 = await supertest(app).get('/api/records').set({Authorization:`Bearer ${response.body.token}`});
        expect(response2.status).toBe(200);
        expect(response2.body[0]).toMatchObject({
            transaction: 'R$ 23,40',
            description: 'iFood',
            type: 'expense',
            date: response2.body[0].date,
            userId: response.body.id
        })
    })
})
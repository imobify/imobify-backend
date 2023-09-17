import * as pactum from 'pactum';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { getUserToken } from '../utils';

const mainUser = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  document: faker.string.numeric({ length: 11 }),
  phone: faker.phone.number('##########'),
  password: faker.internet.password({ prefix: '1Ab' }),
  type_id: faker.helpers.arrayElement([1, 2]),
};

const secondUser = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  document: faker.string.numeric({ length: 11 }),
  phone: faker.phone.number('##########'),
  password: faker.internet.password({ prefix: '1Ab' }),
  type_id: faker.helpers.arrayElement([1, 2]),
};

describe('User e2e', () => {
  beforeAll(async () => {
    await getUserToken(mainUser);
    await getUserToken(secondUser);
  });

  describe('Get me', () => {
    it('Should throw error if request has no bearer token', () => {
      return pactum.spec().get('/users/me').expectStatus(401);
    });

    it('Should get current user data', () => {
      return pactum
        .spec()
        .get('/users/me')
        .withBearerToken(`$S{token_${mainUser.document}}`)
        .expectStatus(200)
        .expectBodyContains(mainUser.name)
        .expectBodyContains(mainUser.document)
        .expectBodyContains(mainUser.email)
        .stores('mainUserId', 'id');
    });
  });

  describe('Edit user', () => {
    it('Should throw error if user in request token is not user in params', async () => {
      return pactum
        .spec()
        .patch('/users/{id}')
        .withPathParams('id', '$S{mainUserId}')
        .withBearerToken(`$S{token_${secondUser.document}}`)
        .expectStatus(401)
        .expectBodyContains('No permission.');
    });

    it('Should throw error with invalid DTO', () => {
      const editUser = {
        name: 'Edit test',
        email: 'notAValidEmail', // invalid DTO because of email
      };

      return pactum
        .spec()
        .patch('/users/{id}')
        .withPathParams('id', '$S{mainUserId}')
        .withBearerToken(`$S{token_${mainUser.document}}`)
        .withBody(editUser)
        .expectStatus(400);
    });

    it('Should succeed with valid DTO', () => {
      const editUser = {
        name: 'Edit test',
        email: 'newemail@gmail.com',
      };

      return pactum
        .spec()
        .patch('/users/{id}')
        .withPathParams('id', '$S{mainUserId}')
        .withBearerToken(`$S{token_${mainUser.document}}`)
        .withBody(editUser)
        .expectStatus(200)
        .expectBodyContains('$S{mainUserId}');
    });
  });
});

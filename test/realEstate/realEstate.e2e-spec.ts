import * as pactum from 'pactum';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { getUserToken } from '../utils';
import * as constants from './helper';

const mainUser = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  document: faker.string.numeric({ length: 11 }),
  phone: faker.phone.number('##########'),
  password: faker.internet.password({ prefix: '1Ab' }),
  type_id: 1, // main user type
};

const announcerUser = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  document: faker.string.numeric({ length: 11 }),
  phone: faker.phone.number('##########'),
  password: faker.internet.password({ prefix: '1Ab' }),
  type_id: 2, // anouncer user type
};

describe('Real Estate e2e', () => {
  beforeAll(async () => {
    await getUserToken(mainUser);
    await getUserToken(announcerUser);
  });

  describe('create real estate', () => {
    it('should throw error if request has no bearer token', () => {
      return pactum.spec().post('/real-estate').withMultiPartFormData(constants.correctCreateForm).expectStatus(401);
    });

    it('should throw error if user in request token is not of announcer type', () => {
      return pactum
        .spec()
        .post('/real-estate')
        .withBearerToken(`$S{token_${mainUser.document}}`)
        .withMultiPartFormData(constants.correctCreateForm)
        .expectStatus(403)
        .expectBodyContains('You do not have permission to access this resource.');
    });

    it('should throw error if request has missing required property', () => {
      return pactum
        .spec()
        .post('/real-estate')
        .withBearerToken(`$S{token_${announcerUser.document}}`)
        .withMultiPartFormData(constants.missingPropertyCreateForm)
        .expectStatus(400);
    });

    it('should throw error if request has invalid property', () => {
      return pactum
        .spec()
        .post('/real-estate')
        .withBearerToken(`$S{token_${announcerUser.document}}`)
        .withMultiPartFormData(constants.invalidPropertyCreateForm)
        .expectStatus(400);
    });

    it('should succeed with valid request', () => {
      return pactum
        .spec()
        .post('/real-estate')
        .withBearerToken(`$S{token_${announcerUser.document}}`)
        .withMultiPartFormData(constants.correctCreateForm)
        .expectStatus(201)
        .expectBodyContains('test real estate')
        .stores('first_real_estate_id', 'id');
    });
  });

  describe('edit real estate', () => {
    it('should throw error if request has no bearer token', () => {
      return pactum
        .spec()
        .patch('/real-estate/{id}')
        .withPathParams('id', '$S{first_real_estate_id}')
        .withMultiPartFormData(constants.editForm)
        .expectStatus(401);
    });

    it('should throw error if user in request token is not of announcer type', () => {
      return pactum
        .spec()
        .patch('/real-estate/{id}')
        .withPathParams('id', '$S{first_real_estate_id}')
        .withBearerToken(`$S{token_${mainUser.document}}`)
        .withMultiPartFormData(constants.editForm)
        .expectStatus(403)
        .expectBodyContains('You do not have permission to access this resource.');
    });

    it('should succeed with valid request', () => {
      return pactum
        .spec()
        .patch('/real-estate/{id}')
        .withPathParams('id', '$S{first_real_estate_id}')
        .withBearerToken(`$S{token_${announcerUser.document}}`)
        .withMultiPartFormData(constants.editForm)
        .expectStatus(200)
        .expectBodyContains('edited test real estate');
    });
  });

  describe('get paginated real estates', () => {
    it('should throw error if request has no bearer token', () => {
      return pactum.spec().get('/real-estate').expectStatus(401);
    });

    it('should throw error if user in request token is not of announcer type', () => {
      return pactum
        .spec()
        .get('/real-estate')
        .withBearerToken(`$S{token_${mainUser.document}}`)
        .expectStatus(403)
        .expectBodyContains('You do not have permission to access this resource.');
    });
  });
});

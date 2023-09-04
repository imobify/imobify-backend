import * as pactum from 'pactum';
import * as constants from './helper';

describe('Auth e2e', () => {
  describe('Signup', () => {
    it('Should throw if email is empty', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.signupDtoNoEmail).expectStatus(400);
    });

    it('Should throw if name is empty', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.signupDtoNoName).expectStatus(400);
    });

    it('Should throw if document is empty', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.signupDtoNoDocument).expectStatus(400);
    });

    it('Should throw if type_id is empty', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.signupDtoNoType).expectStatus(400);
    });

    it('Should throw if password is empty', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.signupDtoNoPassword).expectStatus(400);
    });

    it('Should throw if password is less than 8 characters', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.signupDtoShortPassword).expectStatus(400);
    });

    it('Should throw if password has no capital letters', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.signupDtoPasswordNoCapital).expectStatus(400);
    });

    it('Should throw if password has no numbers', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.signupDtoPasswordNoNumbers).expectStatus(400);
    });

    it('Should succeed with valid DTO', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.correctSignupDto).expectStatus(201);
    });

    it('Should throw if credentials are already in use', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.correctSignupDto).expectStatus(403);
    });
  });
});

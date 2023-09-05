import * as pactum from 'pactum';
import * as constants from './helper';

describe('Auth e2e', () => {
  describe('Signup', () => {
    it('Should throw if email is empty', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.signUp.signupDtoNoEmail).expectStatus(400);
    });

    it('Should throw if name is empty', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.signUp.signupDtoNoName).expectStatus(400);
    });

    it('Should throw if document is empty', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.signUp.signupDtoNoDocument).expectStatus(400);
    });

    it('Should throw if type_id is empty', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.signUp.signupDtoNoType).expectStatus(400);
    });

    it('Should throw if password is empty', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.signUp.signupDtoNoPassword).expectStatus(400);
    });

    it('Should throw if password is less than 8 characters', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.signUp.signupDtoShortPassword).expectStatus(400);
    });

    it('Should throw if password has no capital letters', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.signUp.signupDtoPasswordNoCapital).expectStatus(400);
    });

    it('Should throw if password has no numbers', () => {
      return pactum.spec().post('/auth/signup').withBody(constants.signUp.signupDtoPasswordNoNumbers).expectStatus(400);
    });

    it('Should succeed with valid DTO', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody(constants.correctSignupDto)
        .expectStatus(201)
        .expectBodyContains('access_token')
        .expectBodyContains(constants.correctSignupDto.name);
    });

    it('Should throw if credentials are already in use', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody(constants.correctSignupDto)
        .expectStatus(403)
        .expectBodyContains('Credentials already in use!');
    });
  });

  describe('SignIn', () => {
    it('Should throw if e-mail is empty', () => {
      return pactum.spec().post('/auth/signin').withBody(constants.signIn.signinDtoNoEmail).expectStatus(400);
    });

    it('Should throw if password is empty', () => {
      return pactum.spec().post('/auth/signin').withBody(constants.signIn.signinDtoNoPassword).expectStatus(400);
    });

    it('Should throw if e-mail is invalid', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody(constants.signIn.signinDtoWrongEmail)
        .expectStatus(403)
        .expectBodyContains('Incorrect credentials!');
    });

    it('Should throw if password is incorrect', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody(constants.signIn.signinDtoWrongPassword)
        .expectStatus(403)
        .expectBodyContains('Incorrect credentials!');
    });

    it('Should login user if credentials are correct', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody(constants.correctSignInDto)
        .expectStatus(200)
        .expectBodyContains('access_token')
        .expectBodyContains(constants.correctSignupDto.name);
    });
  });
});

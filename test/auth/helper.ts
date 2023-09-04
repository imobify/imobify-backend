import { SignupDto } from '../../src/auth/dto';

const correctSignupDto: SignupDto = {
  name: 'Test User',
  email: 'test@gmail.com',
  document: '22597409015', // document generated randomly
  password: 'testuser1A!',
  type_id: 1,
};

const signupDtoNoEmail = {
  name: 'Test User',
  document: '22597409015', // document generated randomly
  password: 'testuser1A!',
  type_id: 1,
};

const signupDtoNoName = {
  email: 'test@gmail.com',
  document: '22597409015', // document generated randomly
  password: 'testuser1A!',
  type_id: 1,
};

const signupDtoNoDocument = {
  name: 'Test User',
  email: 'test@gmail.com',
  password: 'testuser1A!',
  type_id: 1,
};

const signupDtoNoPassword = {
  name: 'Test User',
  email: 'test@gmail.com',
  document: '22597409015', // document generated randomly
  type_id: 1,
};

const signupDtoNoType = {
  name: 'Test User',
  email: 'test@gmail.com',
  document: '22597409015', // document generated randomly
  password: 'testuser1A!',
};

const signupDtoShortPassword = {
  name: 'Test User',
  email: 'test@gmail.com',
  document: '22597409015', // document generated randomly
  password: 'test',
  type_id: 1,
};

const signupDtoPasswordNoCapital = {
  name: 'Test User',
  email: 'test@gmail.com',
  document: '22597409015', // document generated randomly
  password: 'testuser1',
  type_id: 1,
};

const signupDtoPasswordNoNumbers = {
  name: 'Test User',
  email: 'test@gmail.com',
  document: '22597409015', // document generated randomly
  password: 'testuserA',
  type_id: 1,
};

export {
  correctSignupDto,
  signupDtoNoName,
  signupDtoNoDocument,
  signupDtoNoEmail,
  signupDtoNoPassword,
  signupDtoNoType,
  signupDtoShortPassword,
  signupDtoPasswordNoCapital,
  signupDtoPasswordNoNumbers,
};

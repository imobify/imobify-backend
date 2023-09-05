import { SigninDto, SignupDto } from '../../src/auth/dto';

const correctSignupDto: SignupDto = {
  name: 'Test User',
  email: 'test@gmail.com',
  document: '22597409015', // document generated randomly
  password: 'testuser1A!',
  type_id: 1,
};

const correctSignInDto: SigninDto = {
  email: 'test@gmail.com',
  password: 'testuser1A!',
};

const signUp = {
  signupDtoNoEmail: {
    name: 'Test User',
    document: '22597409015',
    password: 'testuser1A!',
    type_id: 1,
  },
  signupDtoNoName: {
    email: 'test@gmail.com',
    document: '22597409015',
    password: 'testuser1A!',
    type_id: 1,
  },
  signupDtoNoDocument: {
    name: 'Test User',
    email: 'test@gmail.com',
    password: 'testuser1A!',
    type_id: 1,
  },
  signupDtoNoPassword: {
    name: 'Test User',
    email: 'test@gmail.com',
    document: '22597409015',
    type_id: 1,
  },
  signupDtoNoType: {
    name: 'Test User',
    email: 'test@gmail.com',
    document: '22597409015',
    password: 'testuser1A!',
  },
  signupDtoShortPassword: {
    name: 'Test User',
    email: 'test@gmail.com',
    document: '22597409015',
    password: 'test',
    type_id: 1,
  },
  signupDtoPasswordNoCapital: {
    name: 'Test User',
    email: 'test@gmail.com',
    document: '22597409015',
    password: 'testuser1',
    type_id: 1,
  },
  signupDtoPasswordNoNumbers: {
    name: 'Test User',
    email: 'test@gmail.com',
    document: '22597409015',
    password: 'testuserA',
    type_id: 1,
  },
};

const signIn = {
  signinDtoNoEmail: {
    password: 'testuser1A!',
  },
  signinDtoNoPassword: {
    email: 'test@gmail.com',
  },
  signinDtoWrongEmail: {
    email: 'wrong@gmail.com',
    password: 'testuser1A!',
  },
  signinDtoWrongPassword: {
    email: 'test@gmail.com',
    password: 'testuser2B@',
  },
};

export { correctSignupDto, signUp, signIn, correctSignInDto };

import { fakerPT_BR as faker } from '@faker-js/faker';
import { SigninDto, SignupDto } from '../../src/auth/dto';

const correctSignupDto: SignupDto = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  document: faker.string.numeric({ length: 11 }),
  phone: faker.phone.number('##########'),
  password: faker.internet.password({ prefix: '1Ab' }),
  type_id: faker.helpers.arrayElement([1, 2]),
};

const correctSignInDto: SigninDto = {
  email: correctSignupDto.email,
  password: correctSignupDto.password,
};

const signUp = {
  signupDtoNoEmail: {
    name: faker.person.fullName(),
    document: faker.string.numeric({ length: 11 }),
    phone: faker.phone.number('##########'),
    password: faker.internet.password({ prefix: '1Ab' }),
    type_id: faker.helpers.arrayElement([1, 2]),
  },
  signupDtoInvalidEmail: {
    name: faker.person.fullName(),
    email: 'notanemail',
    document: faker.string.numeric({ length: 11 }),
    phone: faker.phone.number('##########'),
    password: faker.internet.password({ prefix: '1Ab' }),
    type_id: faker.helpers.arrayElement([1, 2]),
  },
  signupDtoInvalidPhone: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    document: faker.string.numeric({ length: 11 }),
    phone: '123',
    password: faker.internet.password({ prefix: '1Ab' }),
    type_id: faker.helpers.arrayElement([1, 2]),
  },
  signupDtoNoPhone: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    document: faker.string.numeric({ length: 11 }),
    password: faker.internet.password({ prefix: '1Ab' }),
    type_id: faker.helpers.arrayElement([1, 2]),
  },
  signupDtoNoName: {
    email: faker.internet.email(),
    document: faker.string.numeric({ length: 11 }),
    phone: faker.phone.number('##########'),
    password: faker.internet.password({ prefix: '1Ab' }),
    type_id: faker.helpers.arrayElement([1, 2]),
  },
  signupDtoNoDocument: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number('##########'),
    password: faker.internet.password({ prefix: '1Ab' }),
    type_id: faker.helpers.arrayElement([1, 2]),
  },
  signupDtoNoPassword: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    document: faker.string.numeric({ length: 11 }),
    phone: faker.phone.number('##########'),
    type_id: faker.helpers.arrayElement([1, 2]),
  },
  signupDtoNoType: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    document: faker.string.numeric({ length: 11 }),
    phone: faker.phone.number('##########'),
    password: faker.internet.password({ prefix: '1Ab' }),
  },
  signupDtoShortPassword: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    document: faker.string.numeric({ length: 11 }),
    phone: faker.phone.number('##########'),
    password: faker.internet.password({ length: 5 }),
    type_id: faker.helpers.arrayElement([1, 2]),
  },
  signupDtoPasswordNoCapital: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    document: faker.string.numeric({ length: 11 }),
    phone: faker.phone.number('##########'),
    password: faker.internet.password({ pattern: /[a-z]/ }),
    type_id: faker.helpers.arrayElement([1, 2]),
  },
  signupDtoPasswordNoNumbers: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    document: faker.string.numeric({ length: 11 }),
    phone: faker.phone.number('##########'),
    password: faker.internet.password({ pattern: /[a-zA-Z]/ }),
    type_id: faker.helpers.arrayElement([1, 2]),
  },
};

const signIn = {
  signinDtoNoEmail: {
    password: correctSignupDto.password,
  },
  signinDtoNoPassword: {
    email: correctSignupDto.email,
  },
  signinDtoWrongEmail: {
    email: faker.internet.email(),
    password: correctSignupDto.password,
  },
  signinDtoWrongPassword: {
    email: correctSignupDto.email,
    password: faker.internet.password({ prefix: '1Ab' }),
  },
};

export { correctSignupDto, signUp, signIn, correctSignInDto };

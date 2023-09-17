import * as FormData from 'form-data-lite';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { CreateRealEstateDto } from '../../src/models/realEstate/dto';

const generateRealEstateForm = (dto: Partial<CreateRealEstateDto>) => {
  const form = new FormData();

  Object.keys(dto).forEach(key => {
    form.append(key, JSON.stringify(dto[key]));
  });

  return form;
};

const parisCoordinates = {
  latitude: 48.864716,
  longitude: 2.349014,
};

export const correctCreateForm = generateRealEstateForm({
  title: 'test real estate',
  description: 'real estate description',
  address: faker.location.streetAddress(true),
  area: 69,
  selling_value: faker.number.float({ min: 100, precision: 0.1, max: 1000000 }),
  renting_value: faker.number.float({ min: 100, precision: 0.1, max: 1000000 }),
  longitude: parisCoordinates.longitude,
  latitude: parisCoordinates.latitude,
  isActive: true,
});

export const missingPropertyCreateForm = generateRealEstateForm({
  description: 'real estate description',
  address: faker.location.streetAddress(true),
  area: 69,
  selling_value: faker.number.float({ min: 100, precision: 0.1, max: 1000000 }),
  renting_value: faker.number.float({ min: 100, precision: 0.1, max: 1000000 }),
  longitude: parisCoordinates.longitude,
  latitude: parisCoordinates.latitude,
  isActive: true,
});

export const invalidPropertyCreateForm = generateRealEstateForm({
  title: 'test real estate',
  description: 'real estate description',
  address: faker.location.streetAddress(true),
  area: 69,
  selling_value: faker.number.float({ min: 1, precision: 0.1, max: 99 }), // selling_value < 100 is invalid
  renting_value: faker.number.float({ min: 100, precision: 0.1, max: 1000000 }),
  longitude: parisCoordinates.longitude,
  latitude: parisCoordinates.latitude,
  isActive: true,
});

export const editForm = generateRealEstateForm({
  title: 'edited test real estate',
});

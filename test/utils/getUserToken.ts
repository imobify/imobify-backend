import * as pactum from 'pactum';

export const getUserToken = async dto => {
  await pactum
    .spec()
    .post('/auth/signup')
    .withBody(dto)
    .expectStatus(201)
    .stores(`token_${dto.document}`, 'access_token');
};

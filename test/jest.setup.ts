import { closeTestServer, setupTestServer } from './utils';

beforeAll(async () => {
  await setupTestServer();
});

afterAll(async () => {
  await closeTestServer();
});

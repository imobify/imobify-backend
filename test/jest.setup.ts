import { closeTestServer, setupTestServer } from './utils/setupTestServer';

beforeAll(async () => {
  await setupTestServer();
});

afterAll(async () => {
  await closeTestServer();
});

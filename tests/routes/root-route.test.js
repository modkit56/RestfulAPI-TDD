const build = require('../../src/app');

let app;

describe('Root Route', () => {
  beforeEach(() => {
    app = build();
  });

  afterEach(() => {
    app.close();
  });

  it('should return 200 when the root route called', async () => {
    const res = await app.inject({
      url: '/',
    });
    expect(res.statusCode).toBe(200);
    // expect(res.json()).toEqual({ hello: 'world' });
    expect(res.json()).toEqual({ nice: 'CI/CD Setup is Complete' });
  });
});

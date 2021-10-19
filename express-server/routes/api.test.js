const app = require ('../app');
const supertest = require ('supertest');
const request = supertest (app);
const redis = require ('redis');

jest.setTimeout (20000);

beforeAll (done => {
  app.on ('ready', done);
});


describe ('GET /api/sample', () => {
  it ('sample data not empty', async done => {
    const res = await request.get ('/api/gis');
    expect (res.status).toBe (200);
    expect (res.body).toHaveProperty ('result');
    expect (res.body.result.length).toBeGreaterThan (0);
    done ();
  });

  it ('sample data property not empty', async done => {
    const res = await request.get ('/api/gis');
    expect (res.status).toBe (200);
    expect (res.body.result[0]).toHaveProperty ('_id');
    expect (res.body.result[0]).toHaveProperty ('country');
    expect (res.body.result[0]).toHaveProperty ('population');
    expect (res.body.result[0]).toHaveProperty ('date');
    expect (res.body.result[0]).toHaveProperty ('confirmed');
    expect (res.body.result[0]).toHaveProperty ('deaths');
    expect (res.body.result[0]).toHaveProperty ('recovered');
    expect (res.body.result[0]).toHaveProperty ('incidence');
    expect (res.body.result[0]).toHaveProperty ('fatality');
    expect (res.body.result[0]).toHaveProperty ('coords');
    done ();
  });
});


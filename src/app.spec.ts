import { build } from './app';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import 'mocha';
import { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

const sandbox = createSandbox();
const validEnv = { SOME_ENV_VARIABLE: 'set env variables like so' };

describe('api', () => {
  let server: FastifyInstance<Server, IncomingMessage, ServerResponse>;

  before(async () => {
    sandbox.stub(process, 'env').value(validEnv);
    server = build();
    await server.ready();
  });

  describe('/status', () => {
    it('GET returns 200', async () => {
      const response = await server.inject({ method: 'GET', url: '/status' });
      expect(response.statusCode).to.equal(200);
      const payload: { status: string } = JSON.parse(response.payload);
      expect(payload).to.deep.equal({ status: 'OK' });
    });
    it('POST returns 404', async () => {
      const response = await server.inject({ method: 'POST', url: '/status' });
      expect(response.statusCode).to.equal(404);
      expect(response.payload).to.deep.equal('{"message":"Route POST:/status not found","error":"Not Found","statusCode":404}');
    });
  });

  describe('/list', () => {
    it('POST returns 201', async () => {
      const response = await server.inject({ method: 'POST', url: '/list' });
      expect(response.statusCode).to.equal(201);
      const payload: { id: string } = JSON.parse(response.payload);
      expect(payload).to.deep.equal({
        id: 'the id of the new list that we will generate and store'
      });
    });
    it('GET returns 404', async () => {
      const response = await server.inject({ method: 'GET', url: '/list' });
      expect(response.statusCode).to.equal(404);
      expect(response.payload).to.deep.equal(
          '{"message":"Route GET:/list not found","error":"Not Found","statusCode":404}'
          );
    });
    it('PUT returns 404', async () => {
      const response = await server.inject({ method: 'PUT', url: '/list' });
      expect(response.statusCode).to.equal(404);
      expect(response.payload).to.deep.equal(
          '{"message":"Route PUT:/list not found","error":"Not Found","statusCode":404}'
          );
    });
  });

  describe('/list/:id', () => {
    it('GET returns 200', async () => {
      const response = await server.inject({ method: 'GET', url: '/list/2' });
      expect(response.statusCode).to.equal(200);
      const payload: { desc: string } = JSON.parse(response.payload);
      expect(payload).to.deep.equal({ desc: 'this will be the VC containing the list' });
    });
    it('POST returns 404', async () => {
      const response = await server.inject({ method: 'POST', url: '/list/2' });
      expect(response.statusCode).to.equal(404);
      expect(response.payload).to.deep.equal(
          '{"message":"Route POST:/list/2 not found","error":"Not Found","statusCode":404}'
          );
    });
    it('PUT returns 404', async () => {
      const response = await server.inject({ method: 'PUT', url: '/list/2' });
      expect(response.statusCode).to.equal(404);
      expect(response.payload).to.deep.equal(
          '{"message":"Route PUT:/list/2 not found","error":"Not Found","statusCode":404}'
          );
    });
  });

  describe('/entry', () => {
    it('POST returns 201', async () => {
      const response = await server.inject({ method: 'POST', url: '/entry' });
      expect(response.statusCode).to.equal(201);
      const payload: { id: string, index: string } = JSON.parse(response.payload);
      expect(payload).to.deep.equal({
        id: 'the id of one of our lists', index: 'newly allocated position in the list'
      });
    });
    it('PUT returns 404', async () => {
      const response = await server.inject({ method: 'PUT', url: '/entry' });
      expect(response.statusCode).to.equal(404);
      expect(response.payload).to.deep.equal(
          '{"message":"Route PUT:/entry not found","error":"Not Found","statusCode":404}');
    });
    it('GET returns 404', async () => {
      const response = await server.inject({ method: 'GET', url: '/entry' });
      expect(response.statusCode).to.equal(404);
      expect(response.payload).to.deep.equal(
          '{"message":"Route GET:/entry not found","error":"Not Found","statusCode":404}'
          );
    });
  });

  describe('/entry/:id/:index', () => {
    const id = '2';
    const index = 4;
    const url = `/entry/${id}/${index}`;

    it('PUT returns 200', async () => {
      const response = await server.inject({ url, method: 'PUT', payload: { value: true } });
      expect(response.statusCode).to.equal(200);
      const payload: { success: boolean, id: string, index: number } = JSON.parse(response.payload);
      expect(payload).to.deep.equal({ id, index, success: true });
    });
    it('POST returns 404', async () => {
      const response = await server.inject({ url, method: 'POST', payload: { value: true } });
      expect(response.statusCode).to.equal(404);
      expect(response.payload).to.deep.equal(
          `{"message":"Route POST:${url} not found","error":"Not Found","statusCode":404}`
          );
    });
    it('GET returns 404', async () => {
      const response = await server.inject({ url, method: 'GET', payload: { value: true } });
      expect(response.statusCode).to.equal(404);
      expect(response.payload).to.deep.equal(
          `{"message":"Route GET:${url} not found","error":"Not Found","statusCode":404}`
          );
    });
  });

});

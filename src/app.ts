import fastify from 'fastify';
import fastifySensible from 'fastify-sensible';

export function build(opts = {}) {

  const server = fastify({
    logger: true
  });

  server.register(require('fastify-cors'), {});
  server.register(fastifySensible);

  server.setErrorHandler((error, request, reply) => {
        // request.log.error(error);
    reply
            .code(500)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send(error);
  });

  server.get('/status', async (request, reply) => {
    reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({ status: 'OK' });
  });

  server.post(
    '/list',
    {
      schema: {
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' }
            }
          }
        }
      }
    },
    async (request, reply) => {
            // creates a new list and returns the id of the list

      const result = { id: 'the id of the new list that we will generate and store' };
      reply
                .code(201)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(result);
    }
    );

  server.get(
    '/list/:id',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              desc: { type: 'string' }
            }
          }
        },
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    async (request, reply) => {
            // returns the given list (i.e, the VC containing the list)

      const result = { desc: 'this will be the VC containing the list' };
      reply
                .code(200)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(result);
    }
    );

  server.post(
    '/entry',
    {
      schema: {
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              index: { type: 'string' }
            }
          }
        }
      }
    },
    async (request, reply) => {
            // returns a previously unused position in a given list
            // and marks it ‘used' in some tracking list
      const result = {
        id: 'the id of one of our lists',
        index: 'newly allocated position in the list'
      };

      reply
                .code(201)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(result);
    }
    );

  server.put(
        '/entry/:id/:index', {
          schema: {
            body: {
              type: 'object',
              properties: {
                value: { type: 'boolean' }
              }
            },
            params: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                index: { type: 'number' }
              }
            }
          }
        },
        async (request, reply) => {
            // sets the boolean value for the given index,
            // i.e., whether the credential has been revoked or not
          const params: any = request.params;
          const { id, index } = params;
          const req: any = request.body;
          const value: boolean = req.value;
          const result = { id, index, success: true };
            // will get the given revocation list, and set the given index:
            // const result = await revocationList.setRevoked(index, value)
          reply
                .code(200)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(result);
        }
    );

  return server;
}

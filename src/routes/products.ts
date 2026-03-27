import { FastifyInstance } from 'fastify';
import { products, createProduct } from '../db/products';
import { productSchema } from '../schemas/product.schema';
import { validate as isUUID } from 'uuid';

export async function productRoutes(fastify: FastifyInstance) {
    fastify.get('/api/products', async(_, reply) => {
        return reply.code(200).send(products);
    });

    fastify.get('/api/products/:id', async(req, reply) => {
        const { id } = req.params as { id: string };

        if(!isUUID(id)) {
            return reply.code(400).send({
                message: 'Invalid UUID format'
            });
        }
        
        const product = products.find(p => p.id === id);

        if(!product) {
            return reply.code(404).send({
                message: 'Product not found'
            });
        }

        return reply.code(200).send(product);
    });

    fastify.post('/api/products', async(req, reply) => {
        try {
            const parsed = productSchema.parse(req.body);
            const newProduct = createProduct(parsed);

            return reply.code(201).send(newProduct);
        } catch(err) {
            return reply.code(400).send({
                message: 'Invalid product data',
                error: err instanceof Error ? err.message : 'Unknown error'
            });
        }
    });

    fastify.put('/api/products/:id', async(req, reply) => {
        const { id } = req.params as { id: string };

        if(!isUUID(id)) {
            return reply.code(400).send({
                message: 'Invalid UUID format'
            });
        }

        const index = products.findIndex(p => p.id === id);

        if(index === -1) {
            return reply.code(404).send({
                message: 'Product not found'
            });
        }

        try {
            const parsed = productSchema.parse(req.body);

            products[index] = { id, ...parsed };

            return reply.code(200).send(products[index]);
        } catch (err) {
            return reply.code(400).send({
                message: 'Invalid product data'
            });
        }
    });

    fastify.delete('/api/products/:id', async(req, reply) => {
        const { id } = req.params as { id: string };

        if(isUUID(id)) {
            return reply.code(400).send({
                message: 'Invalid UUID format'
            });
        }

        const index = products.findIndex(p => p.id === id);

        if(index === -1) {
            return reply.code(404).send({
                message: 'Product not found'
            });
        }

        products.splice(index, 1);

        return reply.code(204).send();
    });
}
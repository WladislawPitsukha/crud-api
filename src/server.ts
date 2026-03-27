import Fastify from 'fastify';
import dotenv from 'dotenv';
import { productRoutes } from './routes/products';

dotenv.config();

const app = Fastify();

app.register(productRoutes);

app.setNotFoundHandler((_, reply) => {
    reply.code(404).send({
        message: 'Route not found'
    });
});

app.setErrorHandler((err, _, reply) => {
    console.error(err);

    reply.code(500).send({
        message: 'Internal server error'
    });
});

const start = async () => {
    try {
        const PORT = Number(process.env.PORT) || 4000;

        await app.listen({ port: PORT});
        console.log('Server is running on port ' + PORT);
    } catch (err) {
        process.exit(1);
    }
}

start();
import coBody from 'co-body';
import config from 'config';
import koa from 'koa';
import koaRoute from 'koa-route';
import jwt from 'jsonwebtoken';
import userRepositoryFactory from './userModel';

const app = koa();

app.use(koaRoute.post('/', function* () {
    const { email, password } = yield coBody(this);
    const userRepository = userRepositoryFactory(this.client);
    const user = yield userRepository.authenticate(email, password);

    if (!user) {
        this.status = 401;
        return;
    }

    this.body = {
        id: user.id,
        email: user.email,
        token: jwt.sign(user, config.jwt.privateKey),
    };
}));

export default app;
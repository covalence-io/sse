import { Router } from 'express';
import { prepStream } from '../utils';

export default function users() {
    const router = Router();

    router
        .get('/', (req, res, next) => {
            res.json({
                id: 1,
                firstname: 'Matt',
                lastname: 'Morgan',
            });
        })
        .get('/stats', (req, res, next) => {
            prepStream(res);

            let counter = 0;
            const i = setInterval(() => {
                counter++;
                res.write('event: message\n');
                res.write(`data: { "value": ${counter} }`);
                res.write('\n\n');
                res.flush();

                if (counter === 5) {
                    clearInterval(i);
                    res.write('event: close\n');
                    res.write(`data: { "time": ${Date.now()} }`);
                    res.write('\n\n');
                    res.flush();
                }
            }, 2000);
        });

    return router;
}
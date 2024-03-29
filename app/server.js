import { createServer } from 'node:http';
import { URL } from 'node:url';
import { pipeline } from 'node:stream/promises';
import { getViewCreator } from './lib/app.js';
import { accessSync, constants, mkdirSync, rmSync, readFileSync, ReadStream, writeFileSync } from 'node:fs';
import { HttpCodes } from './lib/constants.js';
import routes from './routes/routes.js';
import path from 'node:path';

const root_dir = new URL('..', import.meta.url).pathname;

try {
    accessSync(path.join(root_dir, '.env.config.json'), constants.F_OK);
} catch (e) {
    console.error(e);
    writeFileSync(path.join(root_dir, '.env.config.json'), '{}', { flag: 'w' });
}

let static_config = {
    ...JSON.parse(readFileSync(new URL('./.config.json', import.meta.url)).toString()),
    ...JSON.parse(readFileSync(new URL('./../.env.config.json', import.meta.url)).toString())
};

const config = {
    ...static_config,
    root_dir,
    views_dir: path.join(root_dir, 'app', 'views'),
    pages_dir: path.join(root_dir, 'app', 'pages'),
    public_dir: path.join(root_dir, 'public'),
    cache_dir: path.join(root_dir, 'app', 'cache'),
};

static_config = null;

try {
    accessSync(path.join(config.cache_dir, 'pages'), constants.F_OK | constants.R_OK | constants.W_OK);
    rmSync(path.join(config.cache_dir, 'pages'), { recursive: true });
    mkdirSync(path.join(config.cache_dir, 'pages'), { recursive: true });
} catch (e) {
    mkdirSync(path.join(config.cache_dir, 'pages'), { recursive: true });
}

const app = {
    config,
    getView: getViewCreator(
        {
            config,
            shared_data: {
                route_home: routes.home.name,
                route_articles: routes.articles.name,
                route_about: routes.about.name,
                route_contacts: routes.contacts.name,
            }
        }
    ),
};

const handleRequest = async ({ request, response }) => {
    let matchedRoute = null;
    try {
        for (let n in routes) {
            if (routes[n].rule.test(request.url)) {
                matchedRoute = routes[n];
            }
        }
        if (matchedRoute) {
            request.params = request.url.match(matchedRoute.rule).groups;
            let { status, headers, body } = await matchedRoute.handler({ request, app, });
            response.writeHead(status, headers || {});
            if (body instanceof ReadStream) {
                await pipeline(body, response);
            } else {
                response.end(body);
            }
        } else {
            response.writeHead(HttpCodes.NOT_FOUND, 'NOT FOUND');
            response.end();
        }
    } catch (e) {
        response.writeHead(HttpCodes.INTERNAL_ERROR, {});
        response.end();
        console.error(e);
    }
};

const server = createServer(async (request, response) => {
    await handleRequest({ request, response });
});

server.listen(config.port, config.hostname);

process.on('uncaughtException', function (error) {
    console.error(`Uncaught exception: ${error} ${error.stack}`);
});

console.info(`Server running: http://${config.host}:${config.port}`);
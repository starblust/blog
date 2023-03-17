import { createReadStream, constants } from 'node:fs';
import { access } from 'node:fs/promises';
import { HttpCodes, ContentType } from './../lib/constants.js';
import path from 'node:path';

export const name = 'public';

function routeWrapper() {
    const content_types = {
        '.css': ContentType.CSS,
        '.js': ContentType.JS,
        '.ico': ContentType.ICO,
        '.html': ContentType.HTML,
    };
    return async ({ request, app }) => {
        const requested_path = path.normalize(path.join(app.config.public_dir, ...request.params.filepath.split('/')));
        let is_pub_file_exists = app.config.public_dir === requested_path.substring(0, app.config.public_dir.length);
        try {
            if (is_pub_file_exists) {
                await access(requested_path, constants.R_OK);
            }
        } catch (e) {
            is_pub_file_exists = false;
        }
        if (!is_pub_file_exists) {
            return {
                status: HttpCodes.NOT_FOUND,
                headers: {},
                body: null
            };
        }
        return {
            status: HttpCodes.OK,
            headers: {
                'Content-Type': content_types[path.extname(requested_path)] || ContentType.BINARY
            },
            body: createReadStream(requested_path),
        };
    };
}

export const route = routeWrapper();

export default {
    name,
    route,
};

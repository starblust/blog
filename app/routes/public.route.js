import { createReadStream, constants } from 'node:fs';
import { access } from 'node:fs/promises';
import path from 'node:path';

export const name = 'public';

export async function route({ request, app }) {
    const requested_path = path.join(app.config.public_dir, ...request.params.filepath.split('/'));
    let is_pub_file_exists = app.config.public_dir === requested_path.substring(0, app.config.public_dir.length);
    try {
        if (is_pub_file_exists) {
            await access(requested_path, constants.R_OK);
        }
    } catch (e) {
        is_pub_file_exists = false;
    }
    if (false === is_pub_file_exists) {
        return {
            status: 404,
            headers: {},
            body: null
        };
    }
    const content_types = {
        '.css': 'text/css',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.ico': 'image/vnd.microsoft.icon',
    };
    return {
        status: 200,
        headers: {
            'Content-Type': content_types[path.extname(requested_path)] || 'application/octet-stream'
        },
        body: createReadStream(requested_path),
    };
}

export default {
    name,
    route,
};

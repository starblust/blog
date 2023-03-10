import { readFile, writeFile, access } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';

function getViewCreator({ config, shared_data = {} }) {
    const cache_pages = path.join(config.cache_dir, 'pages');
    const views_dir = config.views_dir + path.sep;
    const cache_pages_path = new Map();
    const pages_path = new Map();
    return async ({ name, data = {} }) => {
        let cache_file_path = cache_pages_path.get(name);
        if (!cache_file_path) {
            cache_file_path = path.join(cache_pages, name + '.html');
            cache_pages_path.set(name, cache_file_path);
        }
        if (config.cache) {
            try {
                await access(cache_file_path);
                return createReadStream(cache_file_path);
            } catch (e) {
                console.error(`file not found or no access: ${cache_file_path}`);
            }
        }
        let page_path = pages_path.get(name);
        if (!page_path) {
            page_path = path.join(config.pages_dir, `${name}.html`);
            pages_path.set(name, page_path);
        }
        let buf_html = (await readFile(views_dir + 'layout.html')).toString()
            .replace('#CONTENT#', (await readFile(page_path)).toString()
            );
        data = {
            ...data,
            ...shared_data,
            current_year: (new Date()).getFullYear(),
        };
        for (const n in data) {
            buf_html = buf_html.replaceAll(`{{${n}}}`, data[n]);
        }
        if (config.cache) {
            await writeFile(cache_file_path, buf_html, { flag: 'w' });
        }
        return buf_html;
    };
}

export {
    getViewCreator,
};

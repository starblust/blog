import { readFile, writeFile, access } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';

function getViewCreator({ config, shared_data = {} }) {
    return async ({ name, data = {} }) => {
        if (config.cache) {
            try {
                await access(path.join(config.cache_dir, 'pages', `${name}.html`));
                return createReadStream(path.join(config.cache_dir, 'pages', `${name}.html`));
            } catch (e) {
                // 
            }
        }
        let buf_html = (await readFile(path.join(config.views_dir, 'layout.html'))).toString()
            .replace('#CONTENT#', await readFile(path.join(config.pages_dir, `${name}.html`))
            );
        data = {
            ...data,
            ...shared_data,
        };
        data.current_year = (new Date()).getFullYear();
        for (const n in data) {
            buf_html = buf_html.replace(`{{${n}}}`, data[n]);
        }
        if (config.cache) {
            await writeFile(path.join(config.cache_dir, 'pages', `${name}.html`), buf_html, {flag: 'w'});
        }
        return buf_html;
    };
}

export {
    getViewCreator,
};

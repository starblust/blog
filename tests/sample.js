import { test, describe } from 'node:test';
import { equal } from 'node:assert';

describe('test the path module facilities', function () {
    test('it is absolute path', async function () {
        const path = await import('node:path');
        const my_path = '/root/../subfolder/folder';
        equal(path.isAbsolute(my_path), true);
    });

    test('normalize different paths', async function () {
        const path = await import('node:path');
        const my_path = '/root/../subfolder';
        equal(path.normalize(my_path), '/subfolder');
    });
});
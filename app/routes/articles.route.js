export const name = 'articles';

export async function route({ app }) {
    return {
        status: 200,
        headers: {},
        body: await app.getView({ name: 'articles', data: { page: name, title: 'articles' } })
    };
}

export default {
    name,
    route,
};
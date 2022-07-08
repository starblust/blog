export const name = 'home';

export async function route({ app }) {
    return {
        status: 200,
        headers: {},
        body: await app.getView({ name: 'home', data: { page: name, title: 'home' } }),
    };
}

export default {
    name,
    route,
};
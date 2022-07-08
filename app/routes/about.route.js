export const name = 'about';

export async function route({ app }) {
    return {
        status: 200,
        headers: {},
        body: await app.getView({ name: 'about', data: { page: name, title: 'about' } })
    };
}

export default {
    name,
    route,
};

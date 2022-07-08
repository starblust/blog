export const name = 'contacts';

export async function route({ app }) {
    return {
        status: 200,
        headers: {},
        body: await app.getView({ name: 'contacts', data: { page: name, title: 'contacts' } })
    };
}

export default {
    name,
    route,
};
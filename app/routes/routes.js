
import home from './home.route.js';
import articles from './articles.route.js';
import contacts from './contacts.route.js';
import about from './about.route.js';
import publicFiles from './public.route.js';

export default {
    home: {
        handler: home.route,
        rule: /^\/$/,
        name: home.name,
    },
    publicFiles: {
        handler: publicFiles.route,
        rule: /\/public\/(?<filepath>[a-z0-9_./]+)/i,
        name: publicFiles.name,
    },
    articles: {
        handler: articles.route,
        rule: /\/articles\//,
        name: articles.name,
    },
    about: {
        handler: about.route,
        rule: /^\/about\/$/,
        name: about.name,
    },
    contacts: {
        handler: contacts.route,
        rule: /^\/contacts\/$/,
        name: contacts.name,
    }
};

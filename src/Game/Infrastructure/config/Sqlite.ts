import knex from "knex";

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './Infrastructure/config/dev.sqlite3',
    },
    useNullAsDefault: true
})

export default db;
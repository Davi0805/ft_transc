/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   db-init.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: davi <davi@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/04/08 23:32:49 by davi              #+#    #+#             */
/*   Updated: 2025/04/10 01:32:09 by davi             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import db from "./dist/Infrastructure/config/Sqlite.js"
import fs from "fs"

if (fs.existsSync("./Infrastructure/config/dev.sqlite3")) {
    console.log("Database already exists. Ignoring initialization");
    process.exit(0);
}

// used the readFileSync cause the original ReadSync is async (non-blocking)
const sql_scheme = fs.readFileSync('./Infrastructure/config/init.sql', 'utf-8');

// here i call our db instance
// to read raw queries from init.sql
const queries = sql_scheme
    .split(';')
    .map(query => query.trim())
    .filter(query => query.length > 0);

(async () => {
    try {
        for (const query of queries) {
            await db.raw(query);
        }
        console.log('happiness!');
        process.exit(0);
    } catch (err) {
        console.error('Sadness:', err);
        process.exit(1);
    }
})();
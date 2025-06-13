/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Sqlite.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dmelo-ca <dmelo-ca@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/04/08 22:52:12 by davi              #+#    #+#             */
/*   Updated: 2025/06/13 12:54:57 by dmelo-ca         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// to understand better the lib
// doc of knex - https://knexjs.org/guide/#browser


const knex = require('knex');

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './Infrastructure/config/dev.sqlite3',
    },
    useNullAsDefault: true
});

module.exports = db;
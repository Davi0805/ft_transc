/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Sqlite.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: davi <davi@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/04/08 22:52:12 by davi              #+#    #+#             */
/*   Updated: 2025/04/09 22:58:34 by davi             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// to understand better the lib
// doc of knex - https://knexjs.org/guide/#browser

// todo: learn how to implement connection pools here

const knex = require('knex');

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './Infrastructure/config/dev.sqlite3',
    },
    useNullAsDefault: true
});

module.exports = db;
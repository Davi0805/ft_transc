/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   db-init.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: davi <davi@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/04/08 23:32:49 by davi              #+#    #+#             */
/*   Updated: 2025/04/09 00:48:46 by davi             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const db = require('./config/Sqlite');
const fs = require('fs'); // fstream equivalent

// used the readFileSync cause the original ReadSync is async (non-blocking)
const sql_scheme = fs.readFileSync('./config/init.sql', 'utf-8');

// here i call our db instance
// to read raw queries from init.sql
db.raw(sql_scheme).then(() => {
    console.log('happiness!');
    process.exit(0);
  }).catch(err => {
    console.error('Sadness:', err);
    process.exit(1);
  });
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   User.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: davi <davi@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/04/08 23:53:56 by davi              #+#    #+#             */
/*   Updated: 2025/04/09 00:35:00 by davi             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


// As i read, i think this probably is not gonna be used but
// take like my orthodox canonical form of backend

// DTO
class User {
    constructor({ user_id, name, username, email, password_hash, user_image }) {
        this.user_id = user_id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
        this.user_image = user_image;
    }

    // Getters
    getuser_id() {
        return this.user_id;
    }

    getName() {
        return this.name;
    }

    getUsername() {
        return this.username;
    }

    getEmail() {
        return this.email;
    }

    getPasswordHash() {
        return this.password_hash;
    }

    getUserImage() {
        return this.user_image;
    }

    // Setters
    setuser_id(user_id) {
        this.user_id = user_id;
    }

    setName(name) {
        this.name = name;
    }

    setUsername(username) {
        this.username = username;
    }

    setEmail(email) {
        this.email = email;
    }

    setPasswordHash(password_hash) {
        this.password_hash = password_hash;
    }

    setUserImage(user_image) {
        this.user_image = user_image;
    }
}

module.exports = User;
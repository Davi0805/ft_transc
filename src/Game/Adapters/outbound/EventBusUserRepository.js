
class EventBusUserRepository {

    constructor()
    {
        this.authToken = '_token_';
    }

    async getNicknamesByUserId(user_id)
    {
        try {
            const response = await fetch(`/api/user/users/${user_id}`);

            if (!response.ok) {
            const errorMessage = `DEBUG: get nickname failed ${response.status}`;
            const error = new Error(errorMessage);
            throw error;
            }

            return response.json().username;

            } catch (error) {
                throw error;
            }

    }

};

module.exports = new EventBusUserRepository();
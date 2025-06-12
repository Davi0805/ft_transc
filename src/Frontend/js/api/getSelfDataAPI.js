
export async function getSelfData() {
    try {
        const authToken = localStorage.getItem("authToken"); 
        if (!authToken) throw new Error("No Token");

        const response = await fetch("http://localhost:8080/users/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status == 401 || response.status == 404) {
            throw new Error("Invalid token");
        }

        if (!response.ok) {
            const errorMessage = `Fetch user failed with status ${response.status} and token ${localStorage.getItem("authToken")}`;
            const error = new Error(errorMessage);
            error.status = response.status;
            throw error;
        }

        return await response.json();

    } catch (error) {
        throw error;
    }
}

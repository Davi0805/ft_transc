export async function login(userData) {
  try {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
   
    if (!response.ok) {
      const errorMessage = `Login failed with status ${response.status}`; 
      const error = new Error(errorMessage);
      error.status = response.status;
      throw error; 
    }
    
    return await response.json();
    
  } catch (error) {
    throw error;
  }
}

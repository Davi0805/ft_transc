function renderTwoFactorAuthentication() {
  return `
    <div id="twofa-wrapper" class="twofa-wrapper">
      <h1>Two-Factor Authentication</h1>
   
      <form id="twofa-form">
        <div class="input-box">
          <input id="twofa-code" type="text" placeholder="Enter 2FA Code" name="twofa-code" required />
        </div>
        <button type="submit" class="btn">Verify</button>
      </form>
      <p>Return to <a href='#'>site</a></p>
    </div>
  `;
}

export async function twoFactorAuthentication(token) {
  const container = document.getElementById('log-wrapper');
  container.innerHTML = renderTwoFactorAuthentication();


  const twofaForm = document.getElementById('twofa-form');
  twofaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const value = document.getElementById('twofa-code').value;
    console.log("value" + value);
    console.log("token " + token)
    const response = await fetch('http://localhost:8080/twofa/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 'token': value })
    });

    console.log(response.ok);
    if (!response.ok) {
      console.log('aqui');
      throw new Error(errorData.message || "Login - 2FA Error");
    }

    /*if last page was play redirect to play else homepage */

    saveToken(token);
    window.router.navigateTo('/');
    console.log('SUCCESS')

  });

  return;
}
const VAULT_ADDR = process.env.VAULT_ADDR || 'http://vault:8200';
const VAULT_TOKEN = process.env.VAULT_TOKEN || 'root';

async function getSecret(secretPath, retries = 3, delay = 2000) {
  const url = `${VAULT_ADDR}/v1/secret/data/${secretPath}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'X-Vault-Token': VAULT_TOKEN },
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Vault error: ${res.status} ${errorBody}`);
      }

      const json = await res.json();
      return json.data.data;
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);

      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
      } else {
        console.error('All retry attempts failed.');
        return null; // Return null instead of throwing an error
      }
    }
  }
}

module.exports = { getSecret };
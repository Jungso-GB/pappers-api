require('dotenv').config();
const axios = require('axios');

// Charger les variables d'environnement
const INSEE_API_KEY = process.env.INSEE_API_KEY;
const INSEE_API_SECRET = process.env.INSEE_API_SECRET;
const INSEE_TOKEN_URL = process.env.INSEE_TOKEN_URL || 'https://api.insee.fr/token';
const INSEE_BASE_URL = 'https://api.insee.fr/entreprises/sirene/V3.11';

// Fonction pour obtenir un jeton d'accès
const getAccessToken = async () => {
    const credentials = Buffer.from(`${INSEE_API_KEY}:${INSEE_API_SECRET}`).toString('base64');

    try {
        const response = await axios.post(
            INSEE_TOKEN_URL,
            "grant_type=client_credentials",
            {
                headers: {
                    "Authorization": `Basic ${credentials}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        console.log("Jeton d'accès obtenu :", response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        console.error("Erreur lors de la récupération du jeton :", error.response?.data || error.message);
        throw new Error("Impossible de récupérer un jeton d'accès.");
    }
};

// Fonction pour rechercher une unité légale avec un SIREN
const fetchCompanyDataINSEE = async (siren) => {
    try {
        const token = await getAccessToken();
        const url = `${INSEE_BASE_URL}/siren/${siren}`;

        const response = await axios.get(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        console.log("Données de l'entreprise :", response.data);
    } catch (error) {
        console.error("Erreur lors de la requête API :", error.response?.data || error.message);
    }
};

module.exports = 
{
    fetchCompanyDataINSEE
}
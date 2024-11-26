require('dotenv').config();
const axios = require('axios');

// Charger les variables d'environnement
const INSEE_API_KEY = process.env.INSEE_API_KEY;
const INSEE_API_SECRET = process.env.INSEE_API_SECRET;
const INSEE_TOKEN_URL = process.env.INSEE_TOKEN_URL || 'https://api.insee.fr/token';
const INSEE_BASE_URL = 'https://api.insee.fr/entreprises/sirene/V3.11';

// Étape 2 : Construire la requête multicritères
const buildQuery = (filters) => {
    console.log('Intégration des filtres..')
    const criteria = [];
    if (filters.codeAPE) criteria.push(`periode(activitePrincipaleUniteLegale:${filters.codeAPE})`);
    if (filters.departement) criteria.push(`adresseEtablissement.codePostalEtablissement:${filters.departement}`);
    if (filters.trancheEffectifs) criteria.push(`periode(trancheEffectifsUniteLegale:${filters.trancheEffectifs})`);
    if (filters.categorieEntreprise) criteria.push(`categorieEntreprise:${filters.categorieEntreprise}`);
    return criteria.join(' AND ');
};



// Fonction pour obtenir un jeton d'accès
const getAccessToken = async () => {
    const credentials = Buffer.from(`${INSEE_API_KEY}:${INSEE_API_SECRET}`).toString('base64');
    console.log("Obtention du token de l'API de l'INSEE")
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
const fetchCompaniesDataINSEE = async (filters) => {
    try {
        const query = buildQuery(filters); // Construire la requête
        console.log("Requête construite :", query);

        const token = await getAccessToken();
        const url = `${INSEE_BASE_URL}/siren?q=${encodeURIComponent(query)}&nombre=${filters.nombre}`;

        const response = await axios.get(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la requête API :", error.response?.data || error.message);
    }
};

module.exports = 
{
    fetchCompaniesDataINSEE
}
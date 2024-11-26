const { fetchCompaniesDataINSEE } = require('./getDataAPIINSEE');
const saveToExcel = require("./saveToExcel");

const filtersINSEE = {
    codeAPE: "46.69A", // Code APE pour les entreprises recherchées
    nombre: 10,        // Nombre maximum de résultats
};

const filePath = "./entreprises_extraites.xlsx";

async function main() {
    try {
        console.log("Récupération des entreprises depuis l'API INSEE...");
        const enterprises = await fetchCompaniesDataINSEE(filtersINSEE);

        // Vérification que la réponse contient 'unitesLegales'
        if (!enterprises || !enterprises.unitesLegales) {
            console.error("Aucune donnée 'unitesLegales' trouvée dans la réponse de l'API.");
            return;
        }

        console.log("Données récupérées :", enterprises.unitesLegales);

        // Sauvegarder dans un fichier Excel
        saveToExcel(enterprises.unitesLegales, filePath);

        console.log("Fichier Excel créé avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'exécution :", error.message);
    }
}

main();

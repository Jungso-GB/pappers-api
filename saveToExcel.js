const xlsx = require("xlsx");
const fs = require("fs");

function saveToExcel(data, filePath) {
    // Vérifier si le fichier existe déjà
    if (fs.existsSync(filePath)) {
        console.log(`Fichier existant détecté : ${filePath}. Suppression en cours...`);
        fs.unlinkSync(filePath); // Supprimer le fichier existant
        console.log("Fichier supprimé avec succès.");
    }

    // Préparer les données sous forme d'objets pour Excel
    const formattedData = data.map((item) => ({
        SIREN: item.siren,
        "Date de création": item.dateCreationUniteLegale,
        "Tranche effectifs": item.trancheEffectifsUniteLegale || "Non renseigné",
        "Année effectifs": item.anneeEffectifsUniteLegale || "Non renseigné",
        "Catégorie entreprise": item.categorieEntreprise || "Non renseigné",
        "Dernier traitement": item.dateDernierTraitementUniteLegale,
    }));

    // Création d'une feuille Excel
    const worksheet = xlsx.utils.json_to_sheet(formattedData);

    // Création d'un classeur Excel
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Entreprises");

    // Sauvegarde dans un fichier
    xlsx.writeFile(workbook, filePath);
    console.log(`Fichier Excel créé avec succès : ${filePath}`);
}

module.exports = saveToExcel;

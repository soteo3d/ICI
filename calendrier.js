document.addEventListener('DOMContentLoaded', async function() {
    const downloadButton = document.getElementById('download-pdf-button');
    const pdfIframe = document.getElementById('pdf-iframe');

    if (!downloadButton || !pdfIframe) {
        console.error("Éléments PDF introuvables sur la page.");
        return;
    }

    try {
        // On va chercher le fichier de configuration qui contient le chemin du PDF
        const response = await fetch('/_data/programme.json');
        if (!response.ok) {
            throw new Error('Fichier de configuration du programme introuvable.');
        }
        const data = await response.json();
        const pdfPath = data.fichier_pdf;

        if (pdfPath) {
            // On met à jour la source de la visionneuse et le lien du bouton
            pdfIframe.src = pdfPath;
            downloadButton.href = pdfPath;
        } else {
            console.error("Aucun chemin de PDF trouvé dans la configuration.");
            downloadButton.textContent = "Programme non disponible";
            downloadButton.style.pointerEvents = 'none';
        }

    } catch (error) {
        console.error("Erreur lors du chargement du programme PDF:", error);
    }
});

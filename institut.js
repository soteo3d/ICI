document.addEventListener('DOMContentLoaded', async function() {
    const evenementsContainer = document.getElementById('prochains-evenements-institut');
    if (!evenementsContainer) return;

    const repoOwner = 'soteo3d';
    const repoName = 'ICI';

    async function chargerCollection(folderName) {
        // ... (copiez ici la même fonction chargerCollection que dans calendrier.js) ...
    }
    
    function parseFrontmatter(content) {
        // ... (copiez ici la même fonction parseFrontmatter que dans calendrier.js) ...
    }

    const tousLesEvenements = await chargerCollection('_evenements');
    const maintenant = new Date();

    const evenementsFuturs = tousLesEvenements.filter(event => event.date && new Date(event.date) > maintenant);
    evenementsFuturs.sort((a, b) => new Date(a.date) - new Date(b.date));
    const troisProchainsEvenements = evenementsFuturs.slice(0, 3);

    const listeHtml = evenementsContainer.querySelector('ul');
    listeHtml.innerHTML = '';

    if (troisProchainsEvenements.length > 0) {
        troisProchainsEvenements.forEach(event => {
            // ... (le reste du code pour afficher les 3 événements est inchangé) ...
        });
    } else {
        listeHtml.innerHTML = '<li>Aucun nouvel événement programmé pour le moment.</li>';
    }
});

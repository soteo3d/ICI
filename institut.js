document.addEventListener('DOMContentLoaded', async function() {
    const evenementsListeContainer = document.getElementById('prochains-evenements-institut');

    // Si on n'est pas sur la page Institut, on arrête le script
    if (!evenementsListeContainer) {
        return;
    }

    const repoOwner = 'soteo3d'; // Votre nom d'utilisateur GitHub
    const repoName = 'ICI';      // Le nom de votre projet GitHub

    // Fonction pour lire le contenu d'un dossier via l'API GitHub
    async function chargerCollection(folderName) {
    // On appelle notre propre 'pont' au lieu de l'API GitHub directement
    const url = `/.netlify/functions/getContents?folder=${folderName}`;
    try {
        const response = await fetch(url);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error(`Erreur lors du chargement via la fonction Netlify :`, error);
        return [];
    }
}

    // --- Logique d'affichage ---

    // 1. Charger tous les événements
    const tousLesEvenements = await chargerCollection('_evenements');
    const maintenant = new Date();

    // 2. Filtrer pour ne garder que les événements futurs
    const evenementsFuturs = tousLesEvenements.filter(event => event.date && new Date(event.date) > maintenant);
    
    // 3. Trier ces événements par date (le plus proche en premier)
    evenementsFuturs.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 4. Ne conserver que les 3 premiers
    const troisProchainsEvenements = evenementsFuturs.slice(0, 3);

    // 5. Afficher le résultat
    const listeHtml = evenementsListeContainer.querySelector('ul');
    listeHtml.innerHTML = ''; // On vide la liste d'exemples du HTML

    if (troisProchainsEvenements.length > 0) {
        troisProchainsEvenements.forEach(event => {
            const eventDate = new Date(event.date);
            // Formatte la date en "10 septembre" par exemple
            const formattedDate = eventDate.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long'
            });
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${formattedDate}</strong> – ${event.titre}`;
            listeHtml.appendChild(listItem);
        });
    } else {
        listeHtml.innerHTML = '<li>Aucun nouvel événement programmé pour le moment.</li>';
    }
});

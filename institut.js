document.addEventListener('DOMContentLoaded', async function() {
    const evenementsContainer = document.getElementById('prochains-evenements-institut');

    if (!evenementsContainer) {
        return; // Si on n'est pas sur la bonne page, on ne fait rien
    }

    // Fonction pour charger les données (similaire à celle du calendrier)
    async function chargerDonnees(url) {
        try {
            const reponse = await fetch(url);
            if (!reponse.ok) return [];
            return await reponse.json();
        } catch (erreur) {
            console.error("Impossible de charger les données pour la page Institut:", erreur);
            return [];
        }
    }

    const tousLesEvenements = await chargerDonnees('/_data/evenements.json');
    const maintenant = new Date(); // Date et heure actuelles

    // 1. Filtrer pour ne garder que les événements futurs
    const evenementsFuturs = tousLesEvenements.filter(event => new Date(event.date) > maintenant);
    
    // 2. Trier ces événements par date, du plus proche au plus lointain
    evenementsFuturs.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 3. Ne garder que les 3 premiers
    const troisProchainsEvenements = evenementsFuturs.slice(0, 3);

    const listeHtml = evenementsContainer.querySelector('ul');
    listeHtml.innerHTML = ''; // On vide la liste d'exemples

    if (troisProchainsEvenements.length > 0) {
        troisProchainsEvenements.forEach(event => {
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('fr-FR', {
                month: 'long',
                day: 'numeric'
            });
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${formattedDate}</strong> – ${event.titre}`;
            listeHtml.appendChild(listItem);
        });
    } else {
        listeHtml.innerHTML = '<li>Aucun nouvel événement programmé pour le moment.</li>';
    }
});

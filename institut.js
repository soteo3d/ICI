document.addEventListener('DOMContentLoaded', async function() {
    const evenementsContainer = document.getElementById('prochains-evenements-institut');

    if (!evenementsContainer) {
        return; // Si on n'est pas sur la bonne page, on ne fait rien
    }

    async function chargerDonnees(url) {
        try {
            const reponse = await fetch(`${url}?v=${new Date().getTime()}`);
            if (!reponse.ok) return [];
            return await reponse.json();
        } catch (erreur) {
            console.error("Impossible de charger les données pour la page Institut:", erreur);
            return [];
        }
    }

    const tousLesEvenements = await chargerDonnees('/_data/evenements.json');
    const maintenant = new Date();

    const evenementsFuturs = tousLesEvenements.filter(event => new Date(event.date) > maintenant);
    evenementsFuturs.sort((a, b) => new Date(a.date) - new Date(b.date));
    const troisProchainsEvenements = evenementsFuturs.slice(0, 3);

    const listeHtml = evenementsContainer.querySelector('ul');
    listeHtml.innerHTML = '';

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

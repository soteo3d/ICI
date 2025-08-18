document.addEventListener('DOMContentLoaded', async function() {
    const container = document.getElementById('upcoming-events-container');
    if (!container) return;

    const repoOwner = 'soteo3d';
    const repoName = 'ICI';

    async function chargerEvenements() {
        const url = `/.netlify/functions/getContents?folder=_evenements`;
        try {
            const response = await fetch(url);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error("Erreur de chargement des événements:", error);
            return [];
        }
    }

    const tousLesEvenements = await chargerEvenements();
    const maintenant = new Date();

    const evenementsFuturs = tousLesEvenements
        .filter(event => event.date && new Date(event.date) >= maintenant)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const prochainsEvenements = evenementsFuturs.slice(0, 3);

    container.innerHTML = ''; // On vide le loader

    if (prochainsEvenements.length > 0) {
        prochainsEvenements.forEach(event => {
            const eventDate = new Date(event.date);
            const jour = eventDate.getDate();
            const mois = eventDate.toLocaleString('fr-FR', { month: 'short' }).replace('.', '');

            const cardHTML = `
                <a href="calendrier.html" class="event-card-link fade-in-element">
                    <div class="event-card-preview">
                        <div class="date-preview">
                            <span class="day">${jour}</span>
                            <span class="month">${mois}</span>
                        </div>
                        <div class="title-preview">
                            <h3>${event.titre}</h3>
                            <p>${event.lieu}</p>
                        </div>
                    </div>
                </a>
            `;
            container.innerHTML += cardHTML;
        });
    } else {
        container.innerHTML = '<p class="aucun-evenement">Pas de nouveaux événements prévus pour le moment.</p>';
    }
});

document.addEventListener('DOMContentLoaded', async function() {
    const archiveContainer = document.getElementById('archive-container');
    if (!archiveContainer) return;

    const repoOwner = 'soteo3d';
    const repoName = 'ICI';

    async function chargerCollection(folderName) {
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

    // --- LOGIQUE PRINCIPALE ---
    const tousLesEvenements = await chargerCollection('_evenements');
    const maintenant = new Date();

    // 1. Filtrer pour ne garder que les événements PASSÉS
    const evenementsPasses = tousLesEvenements.filter(event => event.date && new Date(event.date) < maintenant);
    
    // 2. Trier du plus récent au plus ancien
    evenementsPasses.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 3. Afficher le résultat
    archiveContainer.innerHTML = ''; // On enlève le loader

    if (evenementsPasses.length === 0) {
        archiveContainer.innerHTML = '<p class="aucun-evenement">Il n\'y a pas encore d\'événements archivés.</p>';
        return;
    }

    evenementsPasses.forEach(event => {
        // On ne génère une fiche que si un compte-rendu ou des photos existent
        if (!event.compte_rendu && (!event.photos || event.photos.length === 0)) {
            return;
        }

        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

        // Générer la galerie de photos
        let photosHtml = '';
        if (event.photos && event.photos.length > 0) {
            photosHtml += '<div class="photo-gallery">';
            event.photos.forEach(photo => {
                photosHtml += `
                    <figure class="gallery-photo">
                        <a href="${photo.image}" target="_blank"><img src="${photo.image}" alt="${photo.legende || event.titre}"></a>
                        ${photo.legende ? `<figcaption>${photo.legende}</figcaption>` : ''}
                    </figure>
                `;
            });
            photosHtml += '</div>';
        }

        const archiveCardHTML = `
            <div class="archive-entry fade-in-element">
                <h3>${event.titre}</h3>
                <p class="archive-date">A eu lieu le ${formattedDate}</p>
                
                ${event.compte_rendu ? `<div class="compte-rendu">${event.compte_rendu.replace(/\n/g, '<br>')}</div>` : ''}
                
                ${photosHtml}
            </div>
        `;

        archiveContainer.innerHTML += archiveCardHTML;
    });
});

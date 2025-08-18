document.addEventListener('DOMContentLoaded', async function() {
    const archiveContainer = document.getElementById('archive-container');
    if (!archiveContainer) return;
    // --- Éléments de la Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    // --- Éléments de la modale ---
    const modal = document.getElementById('archive-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalTitre = document.getElementById('modal-titre');
    const modalDate = document.getElementById('modal-date');
    const modalCompteRendu = document.getElementById('modal-compte-rendu');
    const modalGalerie = document.getElementById('modal-galerie');

    const repoOwner = 'soteo3d';
    const repoName = 'ICI';

    async function chargerCollection(folderName) {
        const url = `/.netlify/functions/getContents?folder=${folderName}`;
        try {
            const response = await fetch(url);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error(`Erreur :`, error);
            return [];
        }
    }

    // --- LOGIQUE PRINCIPALE ---
    const tousLesEvenements = await chargerCollection('_evenements');
    const maintenant = new Date();
    
    // NOUVEAU : Calculer la date limite (6 mois en arrière)
    const sixMoisEnArriere = new Date();
    sixMoisEnArriere.setMonth(maintenant.getMonth() - 6);

    // 1. Filtrer pour ne garder que les événements PASSÉS dans les 6 derniers mois
    const evenementsRecents = tousLesEvenements.filter(event => {
        const eventDate = new Date(event.date);
        return event.date && eventDate < maintenant && eventDate > sixMoisEnArriere;
    });
    
    // 2. Trier du plus récent au plus ancien
    evenementsRecents.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 3. Afficher les bulles
    archiveContainer.innerHTML = ''; 

    if (evenementsRecents.length === 0) {
        archiveContainer.innerHTML = '<p class="aucun-evenement">Il n\'y a pas d\'événements archivés ces 6 derniers mois.</p>';
        return;
    }

    evenementsRecents.forEach((event, index) => {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        const premierePhoto = (event.photos && event.photos.length > 0) ? `style="background-image: url('${event.photos[0].image}')"` : '';

        const bubbleHTML = `
            <div class="archive-bubble" data-index="${index}" ${premierePhoto}>
                <div class="bubble-overlay">
                    <div class="bubble-titre">${event.titre}</div>
                    <div class="bubble-date">${formattedDate}</div>
                </div>
            </div>
        `;
        archiveContainer.innerHTML += bubbleHTML;
    });

    // --- LOGIQUE DE LA MODALE ---
    function openModal(index) {
        const event = evenementsRecents[index];
        const eventDate = new Date(event.date);

        modalTitre.textContent = event.titre;
        modalDate.textContent = `A eu lieu le ${eventDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;
        
        // On utilise la bibliothèque Marked pour interpréter le texte
        modalCompteRendu.innerHTML = marked.parse(event.compte_rendu || 'Aucun compte-rendu disponible.');

        // On génère la galerie
        modalGalerie.innerHTML = '';
        if (event.photos && event.photos.length > 0) {
            event.photos.forEach(photo => {
                modalGalerie.innerHTML += `
                    <figure class="gallery-photo">
                        <img src="${photo.image}" alt="${photo.legende || event.titre}">
                        ${photo.legende ? `<figcaption>${photo.legende}</figcaption>` : ''}
                    </figure>`;
            });
        } else {
            modalGalerie.innerHTML = '<p>Aucune photo pour cet événement.</p>';
        }

        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    }

    // Écouteurs d'événements
    archiveContainer.addEventListener('click', (e) => {
        const bubble = e.target.closest('.archive-bubble');
        if (bubble) {
            openModal(bubble.dataset.index);
        }
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    // --- LOGIQUE DE LA LIGHTBOX ---

// Ouvre la lightbox quand on clique sur une image de la galerie
modalGalerie.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        lightboxImg.src = e.target.src; // Met la bonne image dans la lightbox
        lightbox.classList.remove('hidden');
    }
});

// Ferme la lightbox
function closeLightbox() {
    lightbox.classList.add('hidden');
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    // On ferme si on clique sur le fond noir, mais pas sur l'image elle-même
    if (e.target === lightbox) {
        closeLightbox();
    }
});
});

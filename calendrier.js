document.addEventListener('DOMContentLoaded', async function() {
    const btnEvenements = document.getElementById('btn-evenements');
    const btnPermanences = document.getElementById('btn-permanences');
    const evenementsContainer = document.getElementById('evenements-container');
    const permanencesContainer = document.getElementById('permanences-container');
    const repoOwner = 'soteo3d';
    const repoName = 'ICI';

    async function chargerCollection(folderName) {
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderName}`;
        try {
            const response = await fetch(url);
            if (!response.ok) return [];
            const files = await response.json();
            
            const dataPromises = files.map(async (file) => {
                const fileResponse = await fetch(file.download_url);
                return fileResponse.json(); // On parse directement le JSON
            });
            return await Promise.all(dataPromises);
        } catch (error) {
            console.error(`Erreur lors du chargement de ${folderName}:`, error);
            return [];
        }
    }

    function afficherEvenements(evenements) {
        // ... (cette fonction reste identique à la version complète précédente)
    }
    function afficherPermanences(permanences) {
        // ... (cette fonction reste identique à la version complète précédente)
    }

    // --- Pour être sûr, voici les fonctions d'affichage complètes ---
    function afficherEvenements(evenements) {
        evenementsContainer.innerHTML = '';
        const maintenant = new Date();
        const evenementsFuturs = evenements.filter(event => event.date && new Date(event.date) >= maintenant);

        if (evenementsFuturs.length === 0) {
            evenementsContainer.innerHTML = '<p class="aucun-evenement">Aucun événement à venir pour le moment.</p>';
            return;
        }
        evenementsFuturs.sort((a, b) => new Date(a.date) - new Date(b.date));
        evenementsFuturs.forEach(event => {
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const formattedTime = eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', 'h');
            const tarifHtml = event.tarif ? `<strong>Tarif :</strong> ${event.tarif}<br>` : '';
            const descriptionHtml = (event.description || '').replace(/\n/g, '<br>');
            const cardHTML = `<div class="event-card"><div class="event-date-box"><div class="event-day">${eventDate.getDate()}</div><div class="event-month">${eventDate.toLocaleString('fr-FR', { month: 'short' }).replace('.', '')}</div></div><div class="event-details"><h3>${event.titre}</h3><p class="event-info"><strong>Quand ?</strong> Le ${formattedDate} à ${formattedTime}<br><strong>Où ?</strong> ${event.lieu}<br>${tarifHtml}</p><div class="event-description"><p>${descriptionHtml}</p></div><button class="toggle-description">Lire la suite</button></div></div>`;
            evenementsContainer.innerHTML += cardHTML;
        });
        activerBoutonsDescription();
    }
    function afficherPermanences(permanences) {
        permanencesContainer.innerHTML = '';
        if (permanences.length === 0) {
            permanencesContainer.innerHTML = '<p class="aucun-evenement">Aucune permanence définie pour le moment.</p>';
            return;
        }
        permanences.forEach(perm => {
            const cardHTML = `<div class="event-card permanence-card"><div class="event-date-box"><div class="permanence-day">${perm.jour}</div></div><div class="event-details"><h3>${perm.titre}</h3><p class="event-info"><strong>Quand ?</strong> Tous les ${perm.jour ? perm.jour.toLowerCase() + 's' : ''} de ${perm.heure}<br><strong>Où ?</strong> ${perm.lieu}</p><p>${perm.description}</p></div></div>`;
            permanencesContainer.innerHTML += cardHTML;
        });
    }
    function activerBoutonsDescription() {
        const tousLesBoutons = document.querySelectorAll('.toggle-description');
        tousLesBoutons.forEach(button => {
            button.addEventListener('click', () => {
                const description = button.previousElementSibling;
                const estOuvert = description.classList.contains('is-expanded');
                if (estOuvert) {
                    description.classList.remove('is-expanded');
                    button.textContent = 'Lire la suite';
                } else {
                    description.classList.add('is-expanded');
                    button.textContent = 'Réduire';
                }
            });
        });
    }
    // Le reste du fichier ne change pas...
    btnEvenements.addEventListener('click', () => { /* ... */ });
    btnPermanences.addEventListener('click', () => { /* ... */ });
    async function initialiser() {
        const [evenements, permanences] = await Promise.all([
            chargerCollection('_evenements'),
            chargerCollection('_permanences')
        ]);
        afficherEvenements(evenements);
        afficherPermanences(permanences);
    }
    initialiser();
});

document.addEventListener('DOMContentLoaded', async function() {
    // --- SÉLECTION DES ÉLÉMENTS ---
    const btnEvenements = document.getElementById('btn-evenements');
    const btnPermanences = document.getElementById('btn-permanences');
    const evenementsContainer = document.getElementById('evenements-container');
    const permanencesContainer = document.getElementById('permanences-container');
    const permanencesSortControls = document.getElementById('permanences-sort-controls'); // Nouveau
    const repoOwner = 'soteo3d';
    const repoName = 'ICI';

    let permanencesData = [];

    // --- FONCTION DE RÉCUPÉRATION DES DONNÉES ---
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

    // --- FONCTIONS D'AFFICHAGE ---
    function afficherEvenements(evenements) {
        evenementsContainer.innerHTML = '';
        const maintenant = new Date();
        const evenementsFuturs = evenements.filter(event => event.date && new Date(event.date) >= maintenant);

        if (evenementsFuturs.length === 0) {
            evenementsContainer.innerHTML = '<p class="aucun-evenement">Aucun événement à venir pour le moment. Créez-en un dans l\'espace d\'administration !</p>';
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
            permanencesContainer.innerHTML = '<p class="aucun-evenement">Aucune permanence définie.</p>';
            return;
        }
        permanences.forEach(perm => {
            const jourDeLaSemaine = perm.jour || '';
            const cardHTML = `<div class="event-card permanence-card"><div class="event-date-box"><div class="permanence-day">${perm.jour}</div></div><div class="event-details"><h3>${perm.titre}</h3><p class="event-info"><strong>Quand ?</strong> Tous les ${jourDeLaSemaine.toLowerCase()}s de ${perm.heure}<br><strong>Où ?</strong> ${perm.lieu}</p><p>${perm.description}</p></div></div>`;
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
    function trierPermanences(critere) {
        const permanencesTriees = [...permanencesData]; // On copie les données originales
        const dayOrder = { "Lundi": 1, "Mardi": 2, "Mercredi": 3, "Jeudi": 4, "Vendredi": 5, "Samedi": 6, "Dimanche": 7 };

        if (critere === 'jour') {
            permanencesTriees.sort((a, b) => (dayOrder[a.jour] || 0) - (dayOrder[b.jour] || 0));
        } else if (critere === 'nom') {
            permanencesTriees.sort((a, b) => a.titre.localeCompare(b.titre));
        }
            afficherPermanences(permanencesTriees);
    }
        
    // --- GESTION DES CLICS (VERSION COMPLÈTE) ---
    btnEvenements.addEventListener('click', () => {
        btnEvenements.classList.add('active');
        btnPermanences.classList.remove('active');
        evenementsContainer.classList.remove('hidden');
        permanencesContainer.classList.add('hidden');
        permanencesSortControls.classList.add('hidden'); // On cache les tris
    });

    btnPermanences.addEventListener('click', () => {
        btnPermanences.classList.add('active');
        btnEvenements.classList.remove('active');
        permanencesContainer.classList.remove('hidden');
        evenementsContainer.classList.add('hidden');
        permanencesSortControls.classList.remove('hidden'); // On affiche les tris
    });
  permanencesSortControls.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            // On enlève la classe 'active' de l'ancien bouton
            permanencesSortControls.querySelector('.active').classList.remove('active');
            // On l'ajoute au bouton cliqué
            e.target.classList.add('active');
            // On lance le tri
            trierPermanences(e.target.dataset.sort);
        }
    });
    // --- INITIALISATION DE LA PAGE ---
    async function initialiser() {
        const [evenements, permanences] = await Promise.all([
            chargerCollection('_evenements'),
            chargerCollection('_permanences')
        ]);
        
        permanencesData = permanences; // On sauvegarde les données originales

        afficherEvenements(evenements);
        trierPermanences('jour'); // On affiche les permanences triées par jour par défaut
    }

    initialiser();
});

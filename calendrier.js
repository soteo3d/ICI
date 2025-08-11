document.addEventListener('DOMContentLoaded', async function() {

    // --- SÉLECTION DES ÉLÉMENTS DU DOM ---
    const btnEvenements = document.getElementById('btn-evenements');
    const btnPermanences = document.getElementById('btn-permanences');
    const evenementsContainer = document.getElementById('evenements-container');
    const permanencesContainer = document.getElementById('permanences-container');

    // --- FONCTION POUR CHARGER LES DONNÉES DEPUIS LES FICHIERS JSON ---
    async function chargerDonnees(url) {
        try {
            const reponse = await fetch(url);
            if (!reponse.ok) {
                throw new Error(`Erreur de chargement: ${reponse.statusText}`);
            }
            return await reponse.json();
        } catch (erreur) {
            console.error("Impossible de charger les données:", erreur);
            return []; // Retourne un tableau vide en cas d'erreur
        }
    }

    // --- FONCTIONS D'AFFICHAGE (inchangées, sauf qu'elles prennent les données en argument) ---

    function afficherEvenements(evenements) {
        evenementsContainer.innerHTML = '';
        if (evenements.length === 0) {
            evenementsContainer.innerHTML = '<p class="aucun-evenement">Aucun événement à venir pour le moment.</p>';
            return;
        }
        evenements.sort((a, b) => new Date(a.date) - new Date(b.date));
        evenements.forEach(event => {
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const formattedTime = eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', 'h');

            const cardHTML = `
                <div class="event-card">
                    <div class="event-date-box">
                        <div class="event-day">${eventDate.getDate()}</div>
                        <div class="event-month">${eventDate.toLocaleString('fr-FR', { month: 'short' }).replace('.', '')}</div>
                    </div>
                    <div class="event-details">
                        <h3>${event.titre}</h3>
                        <p class="event-info"><strong>Quand ?</strong> Le ${formattedDate} à ${formattedTime}<br><strong>Où ?</strong> ${event.lieu}</p>
                        <p>${event.description}</p>
                    </div>
                </div>`;
            evenementsContainer.innerHTML += cardHTML;
        });
    }

    function afficherPermanences(permanences) {
        permanencesContainer.innerHTML = '';
        if (permanences.length === 0) {
            permanencesContainer.innerHTML = '<p class="aucun-evenement">Aucune permanence définie pour le moment.</p>';
            return;
        }
        permanences.forEach(perm => {
            const cardHTML = `
                <div class="event-card permanence-card">
                    <div class="event-date-box">
                        <div class="permanence-day">${perm.jour}</div>
                    </div>
                    <div class="event-details">
                        <h3>${perm.titre}</h3>
                        <p class="event-info"><strong>Quand ?</strong> Tous les ${perm.jour.toLowerCase()}s de ${perm.heure}<br><strong>Où ?</strong> ${perm.lieu}</p>
                        <p>${perm.description}</p>
                    </div>
                </div>`;
            permanencesContainer.innerHTML += cardHTML;
        });
    }
    
    // --- GESTION DES CLICS (inchangée) ---
    btnEvenements.addEventListener('click', () => {
        btnEvenements.classList.add('active');
        btnPermanences.classList.remove('active');
        evenementsContainer.classList.remove('hidden');
        permanencesContainer.classList.add('hidden');
    });

    btnPermanences.addEventListener('click', () => {
        btnPermanences.classList.add('active');
        btnEvenements.classList.remove('active');
        permanencesContainer.classList.remove('hidden');
        evenementsContainer.classList.add('hidden');
    });

    // --- INITIALISATION DE LA PAGE ---
    const evenements = await chargerDonnees('/_data/evenements.json');
    const permanences = await chargerDonnees('/_data/permanences.json');
    afficherEvenements(evenements);
    afficherPermanences(permanences);
});

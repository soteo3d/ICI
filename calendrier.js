document.addEventListener('DOMContentLoaded', function() {

    // --- DONNÉES ---
    // Plus tard, ces données viendront du CMS
    const evenements = [
        {
            date: '2025-09-10T19:00:00',
            titre: 'Conférence sur l\'histoire de Pau',
            lieu: 'Salle de conférence de l\'Institut',
            description: 'Un voyage fascinant à travers les siècles pour découvrir les secrets et les personnages qui ont façonné la ville de Pau.'
        },
        {
            date: '2025-10-22T09:30:00',
            titre: 'Visite culturelle du Château de Morlanne',
            lieu: 'Rendez-vous devant le château',
            description: 'Explorez ce magnifique château médiéval béarnais avec un guide passionné. Covoiturage possible depuis l\'Institut.'
        },
        {
            date: '2025-11-03T18:30:00',
            titre: 'Conférence sur les traditions des Pyrénées',
            lieu: 'Salle de conférence de l\'Institut',
            description: 'Chants, contes et traditions pastorales. Une soirée pour se reconnecter aux racines de notre région.'
        }
    ];

    const permanences = [
        {
            jour: 'Lundi',
            heure: '18h00 - 19h30',
            titre: 'Cours d\'Anglais (conversation)',
            lieu: 'Salle d\'atelier',
            description: 'Pratiquez votre anglais oral dans un groupe convivial. Tous niveaux bienvenus.'
        },
        {
            jour: 'Mercredi',
            heure: '14h30 - 16h00',
            titre: 'Atelier Tricot & Papotage',
            lieu: 'Salle de convivialité',
            description: 'Apportez votre laine et vos aiguilles pour un moment de détente et de partage créatif.'
        },
        {
            jour: 'Vendredi',
            heure: '10h00 - 12h00',
            titre: 'Permanence administrative',
            lieu: 'Bureau d\'accueil',
            description: 'Aide et accompagnement pour vos démarches administratives.'
        }
    ];

    // --- SÉLECTION DES ÉLÉMENTS DU DOM ---
    const btnEvenements = document.getElementById('btn-evenements');
    const btnPermanences = document.getElementById('btn-permanences');
    const evenementsContainer = document.getElementById('evenements-container');
    const permanencesContainer = document.getElementById('permanences-container');

    // --- FONCTIONS D'AFFICHAGE ---

    function afficherEvenements() {
        evenementsContainer.innerHTML = ''; // Vide le conteneur
        evenements.sort((a, b) => new Date(a.date) - new Date(b.date)); // Trie par date

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

    function afficherPermanences() {
        permanencesContainer.innerHTML = ''; // Vide le conteneur
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

    // --- GESTION DES CLICS ---
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
    afficherEvenements();
    afficherPermanences();
});

// On attend que le contenu de la page soit entièrement chargé
document.addEventListener('DOMContentLoaded', function() {

    // --- DONNÉES DE DÉMONSTRATION ---
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
        },
        {
            date: '2025-11-15T14:00:00',
            titre: 'Atelier de langue : Initiation au Béarnais',
            lieu: 'Salle d\'atelier de l\'Institut',
            description: 'Apprenez les bases de la langue béarnaise dans une ambiance ludique et conviviale. Ouvert à tous les niveaux.'
        }
    ];

    const container = document.getElementById('calendrier-container');

    // Si on ne trouve pas le conteneur, on arrête tout
    if (!container) {
        console.error("Le conteneur du calendrier n'a pas été trouvé.");
        return;
    }

    // Trie les événements par date, du plus récent au plus ancien
    evenements.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Si aucun événement, on affiche un message
    if (evenements.length === 0) {
        container.innerHTML = '<p class="aucun-evenement">Aucun événement à venir pour le moment. Revenez bientôt !</p>';
        return;
    }

    // On génère le HTML pour chaque événement
    evenements.forEach(event => {
        const eventDate = new Date(event.date);
        
        // Formatte la date pour un affichage lisible (ex: "Mardi 10 septembre 2025")
        const formattedDate = eventDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Formatte l'heure (ex: "19h00")
        const formattedTime = eventDate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(':', 'h');

        const eventCardHTML = `
            <div class="event-card">
                <div class="event-date-box">
                    <div class="event-day">${eventDate.getDate()}</div>
                    <div class="event-month">${eventDate.toLocaleString('fr-FR', { month: 'short' }).replace('.', '')}</div>
                </div>
                <div class="event-details">
                    <h3>${event.titre}</h3>
                    <p class="event-info">
                        <strong>Quand ?</strong> Le ${formattedDate} à ${formattedTime}<br>
                        <strong>Où ?</strong> ${event.lieu}
                    </p>
                    <p>${event.description}</p>
                </div>
            </div>
        `;
        container.innerHTML += eventCardHTML;
    });

});

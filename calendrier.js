document.addEventListener('DOMContentLoaded', async function() {

    // --- SÉLECTION DES ÉLÉMENTS ---
    const btnEvenements = document.getElementById('btn-evenements');
    const btnPermanences = document.getElementById('btn-permanences');
    const evenementsContainer = document.getElementById('evenements-container');
    const permanencesContainer = document.getElementById('permanences-container');
    const repoOwner = 'soteo3d'; // Votre nom d'utilisateur GitHub
    const repoName = 'ICI';      // Le nom de votre projet GitHub

    // --- FONCTIONS DE RÉCUPÉRATION DES DONNÉES ---

    // Lit le contenu d'un dossier via l'API GitHub
    async function chargerCollection(folderName) {
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderName}`;
        try {
            const response = await fetch(url);
            if (!response.ok) return []; // Si le dossier n'existe pas ou est vide
            const files = await response.json();
            
            const dataPromises = files.map(async (file) => {
                const fileResponse = await fetch(file.download_url);
                const content = await fileResponse.text();
                return parseFrontmatter(content);
            });
            return await Promise.all(dataPromises);
        } catch (error) {
            console.error(`Erreur lors du chargement de la collection ${folderName}:`, error);
            return [];
        }
    }

    // Extrait les données des fichiers (ceux entre les "---")
    function parseFrontmatter(content) {
        const data = {};
        const match = content.match(/---\s*([\s\S]*?)\s*---/);
        if (!match) return data;

        const frontmatter = match[1];
        frontmatter.split('\n').forEach(line => {
            const parts = line.split(':');
            if (parts.length > 1) {
                const key = parts[0].trim();
                const value = parts.slice(1).join(':').trim().replace(/^"(.*)"$/, '$1'); // Gère les guillemets
                data[key] = value;
            }
        });
        return data;
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
        
        // On prépare la ligne pour le tarif, seulement si le tarif existe
        const tarifHtml = event.tarif ? `<strong>Tarif :</strong> ${event.tarif}<br>` : '';

        const cardHTML = `
            <div class="event-card">
                <div class="event-date-box">
                    <div class="event-day">${eventDate.getDate()}</div>
                    <div class="event-month">${eventDate.toLocaleString('fr-FR', { month: 'short' }).replace('.', '')}</div>
                </div>
                <div class="event-details">
                    <h3>${event.titre}</h3>
                    <p class="event-info">
                        <strong>Quand ?</strong> Le ${formattedDate} à ${formattedTime}<br>
                        <strong>Où ?</strong> ${event.lieu}<br>
                        ${tarifHtml}
                    </p>
                    <div class="event-description">
                        <p>${event.description || 'Aucune description.'}</p>
                    </div>
                    <button class="toggle-description">Lire la suite</button>
                </div>
            </div>`;
        evenementsContainer.innerHTML += cardHTML;
    });

    // On active les boutons "Lire la suite" qu'on vient de créer
    activerBoutonsDescription();
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
                        <p class="event-info"><strong>Quand ?</strong> Tous les ${perm.jour ? perm.jour.toLowerCase() + 's' : ''} de ${perm.heure}<br><strong>Où ?</strong> ${perm.lieu}</p>
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

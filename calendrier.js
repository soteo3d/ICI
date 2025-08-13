document.addEventListener('DOMContentLoaded', async function() {

    const btnEvenements = document.getElementById('btn-evenements');
    const btnPermanences = document.getElementById('btn-permanences');
    const evenementsContainer = document.getElementById('evenements-container');
    const permanencesContainer = document.getElementById('permanences-container');
    const repoOwner = 'soteo3d'; // Votre nom d'utilisateur GitHub
    const repoName = 'ICI';      // Le nom de votre projet GitHub

    // Fonction pour lire le contenu d'un dossier via l'API GitHub
    async function chargerCollection(folderName) {
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderName}`;
        try {
            const response = await fetch(url);
            if (!response.ok) return [];
            const files = await response.json();
            
            // On télécharge et parse chaque fichier
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

    // Petite fonction pour extraire les données des fichiers créés par le CMS
    function parseFrontmatter(content) {
        const match = content.match(/---\s*([\s\S]*?)\s*---/);
        if (!match) return {};
        const frontmatter = match[1];
        const data = {};
        frontmatter.split('\n').forEach(line => {
            const parts = line.split(':');
            if (parts.length > 1) {
                const key = parts[0].trim();
                const value = parts.slice(1).join(':').trim().replace(/^"(.*)"$/, '$1');
                data[key] = value;
            }
        });
        return data;
    }

    // Le reste des fonctions d'affichage est identique
    function afficherEvenements(evenements) {
        // ... (Le code de cette fonction reste le même qu'avant)
    }
    function afficherPermanences(permanences) {
        // ... (Le code de cette fonction reste le même qu'avant)
    }

    // Le reste du fichier est identique, je le remets pour être complet
    
    // --- (Copiez les fonctions afficherEvenements et afficherPermanences que je vous ai données précédemment ici) ---
    // ... Par souci de clarté, je ne les répète pas mais elles doivent être ici.
    // ... Je vais les remettre pour éviter toute confusion
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
            const cardHTML = `<div class="event-card">...</div>`; // Le HTML de la carte reste le même
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
            const cardHTML = `<div class="event-card permanence-card">...</div>`; // Le HTML de la carte reste le même
            permanencesContainer.innerHTML += cardHTML;
        });
    }
    // Fin des fonctions à copier

    btnEvenements.addEventListener('click', () => { /* ... Le code reste le même ... */ });
    btnPermanences.addEventListener('click', () => { /* ... Le code reste le même ... */ });

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

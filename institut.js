document.addEventListener('DOMContentLoaded', async function() {
    const evenementsContainer = document.getElementById('prochains-evenements-institut');
    if (!evenementsContainer) return;

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
                const content = await fileResponse.text();
                return parseFrontmatter(content);
            });
            return await Promise.all(dataPromises);
        } catch (error) {
            console.error(`Erreur lors du chargement de la collection ${folderName}:`, error);
            return [];
        }
    }

    function parseFrontmatter(content) {
        const data = {};
        const match = content.match(/---\s*([\s\S]*?)\s*---/);
        if (!match) return data;

        const frontmatter = match[1];
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

    const tousLesEvenements = await chargerCollection('_evenements');
    const maintenant = new Date();

    const evenementsFuturs = tousLesEvenements.filter(event => event.date && new Date(event.date) > maintenant);
    evenementsFuturs.sort((a, b) => new Date(a.date) - new Date(b.date));
    const troisProchainsEvenements = evenementsFuturs.slice(0, 3);

    const listeHtml = evenementsContainer.querySelector('ul');
    listeHtml.innerHTML = '';

    if (troisProchainsEvenements.length > 0) {
        troisProchainsEvenements.forEach(event => {
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long'
            });
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${formattedDate}</strong> – ${event.titre}`;
            listeHtml.appendChild(listItem);
        });
    } else {
        listeHtml.innerHTML = '<li>Aucun nouvel événement programmé pour le moment.</li>';
    }
});

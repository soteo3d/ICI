const { Octokit } = require("@octokit/rest");

exports.handler = async function(event, context) {
  // On récupère le nom du dossier depuis l'URL (ex: _evenements)
  const folder = event.queryStringParameters.folder;

  if (!folder) {
    return { statusCode: 400, body: "Le paramètre 'folder' est manquant." };
  }

  // On initialise la connexion à GitHub avec votre token secret
  const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

  try {
    // 1. On demande à GitHub le contenu du dossier
    const { data: files } = await octokit.repos.getContent({
      owner: 'soteo3d',
      repo: 'ICI',
      path: folder,
    });
    
    // 2. Pour chaque fichier trouvé, on promet de télécharger son contenu
    const downloadPromises = files.map(file => 
      fetch(file.download_url).then(response => response.json())
    );
    
    // 3. On attend que tous les téléchargements soient terminés
    const contents = await Promise.all(downloadPromises);

    // 4. On renvoie la liste des contenus (au format JSON)
    return {
      statusCode: 200,
      body: JSON.stringify(contents),
    };

  } catch (error) {
    // Si le dossier est introuvable (par ex. vide), on renvoie une liste vide, ce qui est normal
    if (error.status === 404) {
      return { statusCode: 200, body: JSON.stringify([]) };
    }
    // Pour les autres erreurs, on les affiche pour le débogage
    return { statusCode: 500, body: error.toString() };
  }
};

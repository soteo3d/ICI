const { Octokit } = require("@octokit/rest");

exports.handler = async function(event, context) {
  const folder = event.queryStringParameters.folder;

  if (!folder) {
    return { statusCode: 400, body: "Le paramètre 'folder' est manquant." };
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

  try {
    const { data: contents } = await octokit.repos.getContent({
      owner: 'soteo3d',
      repo: 'ICI',
      path: folder,
    });
    
    // --- CORRECTION AJOUTÉE ICI ---
    // On ne garde que les éléments qui sont des fichiers, et on ignore les dossiers.
    const files = contents.filter(item => item.type === 'file');

    const downloadPromises = files.map(file => 
      fetch(file.download_url).then(response => response.json())
    );
    
    const data = await Promise.all(downloadPromises);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    if (error.status === 404) {
      return { statusCode: 200, body: JSON.stringify([]) };
    }
    return { statusCode: 500, body: error.toString() };
  }
};

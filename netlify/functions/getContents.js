const { Octokit } = require("@octokit/rest");

exports.handler = async function(event, context) {
  const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
  const folder = event.queryStringParameters.folder;

  if (!folder) {
    return { statusCode: 400, body: "Missing 'folder' parameter" };
  }

  try {
    const { data } = await octokit.repos.getContent({
      owner: 'soteo3d',
      repo: 'ICI',
      path: folder,
    });

    const filesPromises = data.map(file => 
      octokit.repos.getContent({
        owner: 'soteo3d',
        repo: 'ICI',
        path: file.path,
      })
    );

    const filesData = await Promise.all(filesPromises);

    const contents = filesData.map(fileData => {
        const content = Buffer.from(fileData.data.content, 'base64').toString('utf8');
        return JSON.parse(content);
    });

    return {
      statusCode: 200,
      body: JSON.stringify(contents),
    };
  } catch (error) {
    if (error.status === 404) {
      return { statusCode: 200, body: JSON.stringify([]) }; // Dossier vide, on renvoie une liste vide
    }
    return { statusCode: 500, body: error.toString() };
  }
};

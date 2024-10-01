const axios = require('axios');

// Replace with your GitHub token and organization name
const GITHUB_TOKEN = 'token';
const ORGANIZATION_NAME = 'pillarjs';

const subscribeToAllRepos = async () => {
  try {
    const headers = {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
    };

    // Fetch all repositories of the organization
    let page = 1;
    let repos = [];

    while (true) {
      const response = await axios.get(`https://api.github.com/orgs/${ORGANIZATION_NAME}/repos?per_page=100&page=${page}`, { headers });

      if (response.data.length === 0) {
        break;
      }

      repos = repos.concat(response.data);
      page++;
    }

    console.log(`Found ${repos.length} repositories in the organization ${ORGANIZATION_NAME}.`);

    // Subscribe (watch) to each repository
    for (const repo of repos) {
      const { full_name } = repo;
      try {
        await axios.put(
          `https://api.github.com/repos/${full_name}/subscription`,
          { subscribed: true, ignored: false },
          { headers }
        );
        console.log(`Subscribed to ${full_name}`);
      } catch (error) {
        console.error(`Failed to subscribe to ${full_name}: ${error.message}`);
      }
    }

    console.log('Finished subscribing to all repositories.');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

subscribeToAllRepos();
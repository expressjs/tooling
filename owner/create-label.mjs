import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
    auth: 'token', // should have repo and admin:org scope
});

// Set the organization name, label name, color, and description
const orgName = 'org-name';
const labelName = 'label-name';
const labelColor = 'ff0000';
const labelDescription = 'label-description';

async function createLabelInRepo(owner, repo) {
    try {
        await octokit.issues.createLabel({
            owner,
            repo,
            name: labelName,
            color: labelColor,
            description: labelDescription,
        });
        console.log(`Label '${labelName}' created in ${repo}`);
    } catch (error) {
        if (error.status === 422) {
            console.log(`Label '${labelName}' already exists in ${repo}`);
        } else {
            console.error(
                `Failed to create label in ${repo}: ${error.message}`
            );
        }
    }
}

async function createLabelInAllRepos() {
    try {
        const repos = await octokit.paginate(octokit.repos.listForOrg, {
            org: orgName,
        });

        for (const repo of repos) {
            await createLabelInRepo(orgName, repo.name);
        }

        console.log('Label creation completed.');
    } catch (error) {
        console.error(
            `Error fetching repositories or creating labels: ${error.message}`
        );
        process.exit(1);
    }
}

createLabelInAllRepos();
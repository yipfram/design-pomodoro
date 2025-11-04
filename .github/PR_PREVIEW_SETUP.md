# PR Preview Deployment Setup

This repository is configured to automatically create preview deployments for pull requests on GitHub Pages.

## How It Works

### With Branch Protection (Current Setup)

Since the `gh-pages` branch has branch protection rules requiring pull requests, the preview deployment workflow works as follows:

1. **When a PR is opened or updated:**
   - The workflow builds the app with a PR-specific base path
   - Creates a new branch `pr-preview-deploy-{PR#}` from `gh-pages`
   - Adds the preview to a subdirectory: `pr-{PR#}/`
   - Creates a PR to merge this into `gh-pages`
   - Comments on the original PR with instructions

2. **To view the preview:**
   - Merge the preview deployment PR (look for PRs labeled `preview-deployment`)
   - The preview will be available at: `https://{username}.github.io/design-pomodoro/pr-{PR#}/`

3. **When a PR is closed:**
   - The workflow creates a cleanup PR to remove the preview directory
   - Merge the cleanup PR to complete the cleanup

### Enabling Auto-Merge (Recommended)

To make previews deploy automatically without manual intervention:

1. **Enable auto-merge for the repository:**
   - Go to Settings → General → Pull Requests
   - Check "Allow auto-merge"

2. **Enable auto-merge on preview PRs:**
   - When a preview deployment PR is created, enable auto-merge
   - The PR will merge automatically once checks pass

3. **Optional: Use a ruleset or workflow to auto-merge:**
   - Create a workflow that automatically enables auto-merge for PRs with the `preview-deployment` label

### Alternative: Direct Push Setup

If you want previews to deploy instantly without creating PRs, you can configure a Personal Access Token (PAT):

1. **Create a PAT with workflow permissions:**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name like "GH Pages Deploy"
   - Select scopes: `repo` and `workflow`
   - Generate and copy the token

2. **Add the token as a repository secret:**
   - Go to Repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `GH_PAGES_DEPLOY_TOKEN`
   - Value: Paste your PAT
   - Click "Add secret"

3. **Update the workflow to use the PAT:**
   - Edit `.github/workflows/pr-preview.yml`
   - Replace the `peter-evans/create-pull-request` step with:
     ```yaml
     - name: Deploy to GitHub Pages
       uses: peaceiris/actions-gh-pages@v3
       with:
         personal_token: ${{ secrets.GH_PAGES_DEPLOY_TOKEN }}
         publish_dir: ./dist
         destination_dir: pr-${{ github.event.pull_request.number }}
         keep_files: true
     ```

4. **Update the cleanup workflow similarly** to use direct push instead of creating PRs

## Preview URLs

Previews are available at:
```
https://{username}.github.io/design-pomodoro/pr-{PR#}/
```

For example, PR #5 would be at:
```
https://yipfram.github.io/design-pomodoro/pr-5/
```

## Troubleshooting

### Preview PRs not being created
- Check the Actions tab for workflow errors
- Ensure the workflow has `contents: write` and `pull-requests: write` permissions

### Preview not accessible after merging
- Wait a few minutes for GitHub Pages to rebuild
- Check the Actions tab for the "pages-build-deployment" workflow

### Too many preview PRs
- Consider enabling auto-merge to reduce manual work
- Or configure a PAT for direct push deployment (see above)

## Cleanup

Preview deployments are automatically cleaned up when:
- The original PR is closed or merged
- A cleanup PR is created and should be merged to complete the cleanup

If you want to manually clean up old previews:
```bash
git checkout gh-pages
git rm -rf pr-*
git commit -m "Clean up old PR previews"
git push origin gh-pages
```

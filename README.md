# ml4g
Course materials and website content for Machine Learning for Graphs course at Clemson University.

## Adding New Content to the Site

This repository supports three types of content: interactive React components, Jupyter notebooks, and static HTML pages.

### TSX Components (Interactive React Components)

1. **Add component**: Place your `.tsx` file in the `src/` directory
2. **Configure**: Add an entry to `components.config.json`:
   ```json
   "components": {
     "YourComponentName": {
       "title": "Display Name for Component",
       "description": "Brief description of what the component does",
       "topic": "topic-folder-name",
       "order": 1
     }
   }
   ```
3. **Build**: Run `npm run build` to build components, site, and navigation

### Jupyter Notebooks

1. **Add notebook**: Place your `.ipynb` file in the `notebooks/` directory
2. **Configure**: Add an entry to `components.config.json`:
   ```json
   "notebooks": {
     "notebook-key": {
       "title": "Notebook Title",
       "description": "Description of the notebook",
       "topic": "topic-folder-name", 
       "github_path": "notebooks/your-notebook.ipynb",
       "order": 2
     }
   }
   ```
3. **Update navigation**: Run `npm run build:nav`

### Static HTML Pages

1. **Add directly**: Place `.html` files in `docs/topics/topic-name/`
2. **Manual update**: Add links to the navigation sections in `docs/index.html`

### Topic Configuration

Define topics in `components.config.json`:
```json
"topics": {
  "topic-folder": {
    "title": "Topic Display Name",
    "order": 1
  }
}
```

### Repository Configuration

For notebook links to work properly, configure your repository details in `components.config.json`:
```json
"repository": {
  "owner": "your-username",
  "name": "your-repo-name", 
  "branch": "main"
}
```

### Build Commands

- `npm run build` - Build components, site, and navigation
- `npm run build:components` - Build only the React components
- `npm run build:site` - Build only the site structure
- `npm run build:nav` - Update navigation only
- `npm run dev` - Start development server
- `npm run clean` - Clean build artifacts

### Deployment

The site is automatically deployed via GitHub Actions when changes are pushed to the repository. The build process generates static files in the `docs/` directory that are served by GitHub Pages.

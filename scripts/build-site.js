const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

// Simple glob replacement for finding JS files
async function findJSFiles(dir) {
  const files = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...await findJSFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory doesn't exist, return empty array
  }
  return files;
}

// Load component configuration
const loadComponentConfig = () => {
  try {
    const configPath = path.join(process.cwd(), 'components.config.json');
    const configData = fsSync.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.warn('Warning: components.config.json not found. Using default configuration.');
    return { components: {}, topics: {}, notebooks: {} };
  }
};

// HTML template for React component pages
const createComponentHTML = (componentName, jsPath, config) => {
  const title = config?.title || componentName;
  const description = config?.description || '';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Machine Learning for Graphs</title>
    <meta name="description" content="${description}">
    <link rel="stylesheet" href="../../assets/css/component-page.css">
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <!-- Add other dependencies as needed -->
    <script src="https://unpkg.com/d3@7"></script>
    <script src="https://unpkg.com/plotly.js-dist@2"></script>
</head>
<body>
    <header class="component-header">
        <nav class="breadcrumb">
            <a href="../../index.html">Home</a> > 
            <!--<a href="../index.html">Interactive Resources</a> > -->
            <span>${title || componentName}</span>
        </nav>
        <h1>${title}</h1>
        ${description ? `<p class="component-description">${description}</p>` : ''}
    </header>
    
    <main class="component-main">
        <div id="react-root"></div>
    </main>
    
    <footer class="component-footer">
        <p><a href="../../index.html">← Back to Course Resources</a></p>
    </footer>
    
    <script src="${jsPath}"></script>
    <script>
        // Mount the React component
        if (window.${componentName}) {
            ReactDOM.render(React.createElement(window.${componentName}), document.getElementById('react-root'));
        } else {
            console.error('Component ${componentName} not found');
        }
    </script>
</body>
</html>
`;
};

const componentPageCSS = `
/* Component page styling */
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f8f9fa;
    color: #212529;
    line-height: 1.6;
}

.component-header {
    background: white;
    border-bottom: 1px solid #dee2e6;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.breadcrumb {
    font-size: 0.9rem;
    color: #6c757d;
    margin-bottom: 0.5rem;
}

.breadcrumb a {
    color: #2980b9;
    text-decoration: none;
}

.breadcrumb a:hover {
    text-decoration: underline;
}

.component-header h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 300;
    color: #2980b9;
}

.component-main {
    padding: 2rem;
    min-height: calc(100vh - 200px);
}

#react-root {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    min-height: 500px;
}

.component-footer {
    background: white;
    border-top: 1px solid #dee2e6;
    padding: 1rem 2rem;
    text-align: center;
}

.component-footer a {
    color: #2980b9;
    text-decoration: none;
    font-weight: 500;
}

.component-footer a:hover {
    text-decoration: underline;
}

/* Responsive design */
@media (max-width: 768px) {
    .component-header, .component-main, .component-footer {
        padding: 1rem;
    }
    
    .component-header h1 {
        font-size: 1.5rem;
    }
}
`;

async function buildSite() {
  console.log('🏗️  Building site structure...');
  
  // Load component configuration
  const config = loadComponentConfig();
  
  // Create CSS for component pages
  await fs.mkdir('docs/assets/css', { recursive: true });
  await fs.writeFile('docs/assets/css/component-page.css', componentPageCSS);
  
  // Find built components and create HTML pages
  const componentFiles = await findJSFiles('docs/assets/js/components');
  
  for (const componentFile of componentFiles) {
    const componentName = path.basename(componentFile, '.js');
    const componentConfig = config.components[componentName];
    
    if (!componentConfig) {
      console.warn(`Warning: No configuration found for component ${componentName}. Skipping.`);
      continue;
    }
    
    const topicDir = componentConfig.topic;
    const outputDir = path.join('docs/topics', topicDir);
    await fs.mkdir(outputDir, { recursive: true });
    
    const jsPath = path.relative(outputDir, componentFile);
    const htmlContent = createComponentHTML(componentName, jsPath, componentConfig);
    
    // Convert component name to kebab-case for filename
    const filename = componentName.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1);
    const outputFile = path.join(outputDir, `${filename}.html`);
    
    await fs.writeFile(outputFile, htmlContent);
    console.log(`📄 Created ${outputFile}`);
  }
  
  // Generate updated navigation for index.html if requested
  if (process.argv.includes('--update-nav')) {
    await generateNavigationUpdate(config);
  }
  
  console.log('🎉 Site build complete!');
}

async function generateNavigationUpdate(config) {
  console.log('🧭 Generating navigation update...');
  
  // Validate repository configuration for notebooks
  if (!config.repository || !config.repository.owner || !config.repository.name) {
    console.warn('Warning: Repository configuration missing. Notebook links will need manual updating.');
    console.warn('Add repository config to components.config.json:');
    console.warn('  "repository": { "owner": "your-username", "name": "your-repo-name", "branch": "main" }');
  }
  
  const repoConfig = config.repository || {};
  const baseGitHubUrl = `https://github.com/${repoConfig.owner}/${repoConfig.name}/blob/${repoConfig.branch || 'main'}`;
  
  // Group components by topic and sort
  const topicGroups = {};
  
  Object.entries(config.components).forEach(([componentName, componentConfig]) => {
    const topic = componentConfig.topic;
    if (!topicGroups[topic]) {
      topicGroups[topic] = [];
    }
    
    const filename = componentName.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1);
    topicGroups[topic].push({
      name: componentName,
      config: componentConfig,
      filename: filename,
      path: `topics/${topic}/${filename}.html`,
      type: 'component'
    });
  });
  
  // Add notebooks to topic groups
  Object.entries(config.notebooks || {}).forEach(([notebookKey, notebookConfig]) => {
    const topic = notebookConfig.topic;
    if (!topicGroups[topic]) {
      topicGroups[topic] = [];
    }
    
    const githubUrl = `${baseGitHubUrl}/${notebookConfig.github_path}`;
    topicGroups[topic].push({
      name: notebookKey,
      config: notebookConfig,
      path: githubUrl,
      type: 'notebook'
    });
  });
  
  // Sort topics and items within each topic
  const sortedTopics = Object.keys(topicGroups)
    .sort((a, b) => (config.topics[a]?.order || 999) - (config.topics[b]?.order || 999));
  
  sortedTopics.forEach(topic => {
    topicGroups[topic].sort((a, b) => (a.config.order || 999) - (b.config.order || 999));
  });
  
  // Generate navigation HTML
  let navHTML = '';
  sortedTopics.forEach(topicKey => {
    const topicConfig = config.topics[topicKey];
    const topicTitle = topicConfig?.title || topicKey;
    
    navHTML += `            <div class="nav-section">\n`;
    navHTML += `                <h3>${topicTitle}</h3>\n`;
    navHTML += `                <ul class="nav-list">\n`;
    
    topicGroups[topicKey].forEach(item => {
      if (item.type === 'component') {
        navHTML += `                    <li><a href="${item.path}">${item.config.title}</a></li>\n`;
      } else if (item.type === 'notebook') {
        const target = repoConfig.owner ? ' target="_blank" rel="noopener"' : '';
        navHTML += `                    <li><a href="${item.path}"${target}>${item.config.title}<span class="badge">Notebook</span></a></li>\n`;
      }
    });
    
    navHTML += `                </ul>\n`;
    navHTML += `            </div>\n\n`;
  });
  
  // Write navigation template file for manual integration
  await fs.writeFile('docs/navigation-generated.html', navHTML);
  console.log('📝 Generated navigation HTML in docs/navigation-generated.html');
  console.log('   Copy this content to replace the navigation sections in your index.html');
  
  // Also generate a complete updated index.html if the original exists
  try {
    const indexPath = 'docs/index.html';
    await fs.access(indexPath);
    let indexContent = await fs.readFile(indexPath, 'utf8');
    
    // Replace navigation sections (between <!-- NAV_START --> and <!-- NAV_END --> comments)
    const navStartComment = '<!-- NAV_START -->';
    const navEndComment = '<!-- NAV_END -->';
    
    if (indexContent.includes(navStartComment) && indexContent.includes(navEndComment)) {
      const beforeNav = indexContent.split(navStartComment)[0];
      const afterNav = indexContent.split(navEndComment)[1];
      const updatedContent = beforeNav + navStartComment + '\n' + navHTML + '            ' + navEndComment + afterNav;
      
      await fs.writeFile('docs/index-updated.html', updatedContent);
      console.log('📝 Generated complete updated index.html as docs/index-updated.html');
      console.log('   Review and rename to index.html when ready');
    } else {
      console.log('💡 Tip: Add <!-- NAV_START --> and <!-- NAV_END --> comments around your navigation');
      console.log('   sections in index.html for automatic updates');
    }
  } catch (error) {
    console.log('ℹ️  Could not auto-update index.html (this is optional)');
  }
}

buildSite().catch(console.error);
const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const { build } = require('vite');

async function buildComponents() {
  console.log('🔨 Building React components...');
  
  // Find all TSX components in src directory
  const componentFiles = await glob('src/components/**/*.tsx');
  
  if (componentFiles.length === 0) {
    console.log('No TSX components found in src/components/');
    return;
  }

  // Ensure output directories exist
  await fs.ensureDir('docs/assets/js/components');
  
  for (const componentFile of componentFiles) {
    const componentName = path.basename(componentFile, '.tsx');
    const relativePath = path.relative('src/components', componentFile);
    const outputDir = path.join('docs/assets/js/components', path.dirname(relativePath));
    
    console.log(`Building ${componentName}...`);
    
    try {
      await build({
        configFile: false,
        plugins: [require('@vitejs/plugin-react')()],
        build: {
          lib: {
            entry: componentFile,
            name: componentName,
            fileName: () => `${componentName}.js`,
            formats: ['umd']
          },
          rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM'
              }
            }
          },
          outDir: outputDir,
          emptyOutDir: false
        },
        define: {
          'process.env.NODE_ENV': '"production"'
        }
      });
      
      console.log(`✅ Built ${componentName}`);
    } catch (error) {
      console.error(`❌ Error building ${componentName}:`, error);
    }
  }
  
  console.log('🎉 Component build complete!');
}

buildComponents().catch(console.error);
const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');

// Read the complete header from index.html
const indexContent = fs.readFileSync('index.html', 'utf8');
const headerStartStr = '<header class="site-header">';
const headerEndStr = '</header>';
const headerMatch = indexContent.substring(
  indexContent.indexOf(headerStartStr),
  indexContent.indexOf(headerEndStr) + headerEndStr.length
);

// We need to create a base header where NO link is active
let baseHeader = headerMatch
  .replace('<a class="nav-link active" href="index.html">Start</a>', '<a class="nav-link" href="index.html">Start</a>')
  .replace('<a class="active" href="index.html">Start</a>', '<a href="index.html">Start</a>');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const fileHeaderStart = content.indexOf(headerStartStr);
  const fileHeaderEnd = content.indexOf(headerEndStr) + headerEndStr.length;
  
  if (fileHeaderStart !== -1 && fileHeaderEnd !== -1) {
    let customHeader = baseHeader;
    
    // Set active class based on file name
    const pagesWithNav = [
      { file: 'aktualnosci.html', name: 'Aktualności' },
      { file: 'apartamenty.html', name: 'Apartamenty' },
      { file: 'lokalizacja.html', name: 'Lokalizacja' },
      { file: 'galeria.html', name: 'Galeria' },
      { file: 'opinie.html', name: 'Opinie' },
      { file: 'faq.html', name: 'FAQ' },
      { file: 'kontakt.html', name: 'Kontakt' },
      { file: 'udogodnienia.html', name: 'Udogodnienia' }
    ];

    const matchedPage = pagesWithNav.find(p => p.file === file);
    
    if (matchedPage) {
      const { file: href, name } = matchedPage;
      // Replace nav-links
      customHeader = customHeader.replace(
        `<a class="nav-link" href="${href}">${name}</a>`, 
        `<a class="nav-link active" href="${href}">${name}</a>`
      );
      // Replace mobile-menu
      customHeader = customHeader.replace(
        `<a href="${href}">${name}</a>`, 
        `<a class="active" href="${href}">${name}</a>`
      );
    }
    
    // Replace the old header with the new one
    content = content.substring(0, fileHeaderStart) + customHeader + content.substring(fileHeaderEnd);
    fs.writeFileSync(file, content, 'utf8');
  }
});
console.log('Zaktualizowano nawigację we wszystkich plikach HTML.');
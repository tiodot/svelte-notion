/**
 * build sitemap from output
 */
import fs from 'fs';
import path from 'path';
import * as devalue from 'devalue'
import { fileURLToPath } from 'url';
import {idToUuid} from 'notion-utils';

const host = process.env.HOST;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = fs.readFileSync(path.resolve(__dirname, '../build/__data.json'), {encoding: 'utf-8'});
const blockMap = devalue.unflatten(JSON.parse(data).nodes[1].data)?.recordMap?.block ?? {}; 


function createSitemapXml(urls) {
  let urlsXml = ''
  urls.forEach(u => {
    urlsXml += `<url>
      <loc>${u.loc}</loc>
      <lastmod>${u.lastmod}</lastmod>
      <changefreq>${u.changefreq}</changefreq>
      <priority>0.7</priority>
    </url>
    `
  })

  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  >
    ${urlsXml}
  </urlset>`
}


fs.readdir(path.resolve(__dirname, '../build'), {withFileTypes: true}, (err, files) => {
  // console.log(files)
  const filesNames = files.filter(file => file.isDirectory() && file.name !== '_app').map(file => file.name)
  // console.log(filesNames)
  const urls = [{
    loc: host,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily'
  }]

  filesNames.forEach(name => {
    const matched = name.match(/-(\w{32})$/)
    if (matched && matched[1]) {
      const id = idToUuid(matched[1])
      const block = blockMap[id]
      // console.log(block, '<----')
      urls.push({
        loc: `${host}/${name}`,
        lastmod: new Date(block.value.last_edited_time || block.value.created_time).toISOString().split('T')[0],
        changefreq: 'daily'
      })
    }
  })
  // console.log(urls)
  const content = createSitemapXml(urls)
  fs.writeFile(path.resolve(__dirname, '../build/sitemap.xml'), content, console.log)
})

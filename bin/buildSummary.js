'use strict';

const fs = require('fs');
const join = require('path').join;

const YAML = require('yaml');

function buildSummary(homedir) {
  let dirs = fs.readdirSync(homedir).filter((item) => item.length === 32);

  let summary = ['<!-- AUTOMATICALLY GENERATED BY BUILD_SUMMARY -->'];
  summary.push('# Table of contents\n');
  summary.push('[Introduction](README.md)\n');

  for (let dir of dirs) {
    let file = join(homedir, dir, 'index.yml');
    let localSummary = ['<!-- AUTOMATICALLY GENERATED BY BUILD_SUMMARY -->'];
    if (fs.existsSync(file)) {
      let yaml = fs.readFileSync(file, 'utf8');
      let toc = YAML.parse(yaml);
      summary.push(`## ${toc.description} [](${dir}/index.yml)\n`);
      localSummary.push(`## ${toc.description} [](${dir}/index.yml)\n`);
      localSummary.push('## TIPS\n');
      let tips = toc.tips.sort((a, b) => a.index - b.index);
      for (let tip of tips) {
        if (!tip.title || !tip.name) {
          console.log('tip.title and tip.name are mandatory', dir, tip);
          continue;
        }
        let linkFile = join(homedir, dir, tip.name, 'index.md');
        if (!fs.existsSync(linkFile)) {
          console.log('The file does not exist: ', linkFile);
        }
        summary.push(`* [${tip.title}](${dir}/${tip.name}/index.md)`);
        localSummary.push(`* [${tip.title}](${tip.name}/index.md)`);
        let localSummaryFile = join(homedir, dir, 'SUMMARY.md');
        fs.writeFileSync(localSummaryFile, localSummary.join('\n'));
      }
      summary.push('');
    }
  }

  let summaryFile = join(homedir, 'SUMMARY.md');
  fs.writeFileSync(summaryFile, summary.join('\n'));
  let readmeFile = join(homedir, 'README.md');
  fs.writeFileSync(readmeFile, '');
}

module.exports = buildSummary;

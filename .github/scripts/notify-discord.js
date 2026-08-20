#!/usr/bin/env node

const webhookUrl = process.env.DISCORD_WEBHOOK;
if (!webhookUrl) {
  console.log('ℹ️ DISCORD_WEBHOOK is not configured. Skipping notification.');
  process.exit(0);
}

const status = (process.env.JOB_STATUS || 'unknown').toLowerCase();
const moduleName = process.env.MODULE || 'Task Manager';
const jobName = process.env.JOB_NAME || 'CI Job';
const branch = process.env.GITHUB_REF_NAME || process.env.BRANCH || 'unknown';
const actor = process.env.GITHUB_ACTOR || 'system';
const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';
const repo = process.env.GITHUB_REPOSITORY || 'DiegoVilla27/task-manager-system';
const runId = process.env.GITHUB_RUN_ID || '';
const runUrl = runId ? `${serverUrl}/${repo}/actions/runs/${runId}` : `${serverUrl}/${repo}`;
const commitMsg = (process.env.COMMIT_MESSAGE || 'CI Triggered').split('\n')[0].substring(0, 120);

let color = 15965458; // Yellow/Orange
let emoji = '⚠️';
let statusText = 'CANCELLED';

if (status === 'success') {
  color = 3066993; // Green
  emoji = '✅';
  statusText = 'PASSED';
} else if (status === 'failure') {
  color = 15158332; // Red
  emoji = '❌';
  statusText = 'FAILED';
}

const payload = {
  username: 'GitHub Actions CI',
  avatar_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  embeds: [
    {
      title: `${emoji} [${moduleName}] ${jobName}: ${statusText}`,
      color: color,
      description: `**Commit:** \`${commitMsg}\``,
      fields: [
        { name: '🌿 Rama', value: `\`${branch}\``, inline: true },
        { name: '👤 Autor', value: `\`${actor}\``, inline: true },
        { name: '🔍 Logs', value: `[Ver Ejecución](${runUrl})`, inline: true }
      ],
      footer: { text: `Task Manager • ${moduleName} CI` },
      timestamp: new Date().toISOString()
    }
  ]
};

fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
  .then(res => {
    if (!res.ok) {
      console.warn(`⚠️ Discord responded with status: ${res.status}`);
    } else {
      console.log('✅ Discord notified successfully.');
    }
  })
  .catch(err => {
    console.warn(`⚠️ Failed to notify Discord: ${err.message}`);
  });

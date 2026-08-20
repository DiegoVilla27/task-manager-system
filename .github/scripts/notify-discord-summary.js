#!/usr/bin/env node

const webhookUrl = process.env.DISCORD_WEBHOOK;
if (!webhookUrl) {
  console.log('ℹ️ DISCORD_WEBHOOK is not configured. Skipping notification.');
  process.exit(0);
}

const moduleName = process.env.MODULE || 'Task Manager';
const changed = process.env.CHANGED === 'true';

// Si este módulo no tuvo cambios, no generamos ruido en Discord
if (!changed) {
  console.log(`ℹ️ [${moduleName}] Sin cambios detectados. Omitiendo notificación de Discord para evitar spam.`);
  process.exit(0);
}

const staticResult = process.env.STATIC_RESULT || 'skipped';
const unitResult = process.env.UNIT_RESULT || 'skipped';
const integrationResult = process.env.INTEGRATION_RESULT || 'skipped';
const buildResult = process.env.BUILD_RESULT || 'skipped';
const sonarResult = process.env.SONAR_RESULT || 'skipped';

const branch = process.env.GITHUB_REF_NAME || process.env.BRANCH || 'unknown';
const actor = process.env.GITHUB_ACTOR || 'system';
const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';
const repo = process.env.GITHUB_REPOSITORY || 'DiegoVilla27/task-manager-system';
const runId = process.env.GITHUB_RUN_ID || '';
const runUrl = runId ? `${serverUrl}/${repo}/actions/runs/${runId}` : `${serverUrl}/${repo}`;
const commitMsg = (process.env.COMMIT_MESSAGE || 'CI Triggered').split('\n')[0].substring(0, 120);

const formatStatus = (res) => {
  switch (res) {
    case 'success':
      return '✅ Exitoso';
    case 'failure':
      return '❌ Fallido';
    case 'cancelled':
      return '⚠️ Cancelado';
    case 'skipped':
    default:
      return '⏭️ Omitido';
  }
};

let color;
let title;

const allSuccess =
  staticResult === 'success' &&
  unitResult === 'success' &&
  integrationResult === 'success' &&
  buildResult === 'success' &&
  sonarResult === 'success';

const hasFailure = [staticResult, unitResult, integrationResult, buildResult, sonarResult].includes('failure');

if (allSuccess) {
  color = 3066993; // Green (#2ECC71)
  title = `🎉 [${moduleName}] Quality Gate PASSED - Todo Exitoso`;
} else if (hasFailure) {
  color = 15158332; // Red (#E74C3C)
  title = `🚨 [${moduleName}] Quality Gate FAILED - Errores en Pipeline`;
} else {
  color = 15965458; // Yellow (#F39C12)
  title = `⚠️ [${moduleName}] Quality Gate Concluido con Avisos`;
}

const payload = {
  username: 'GitHub Actions CI',
  avatar_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  embeds: [
    {
      title: title,
      color: color,
      description: `**Commit:** \`${commitMsg}\`\n**Rama:** \`${branch}\` • **Autor:** \`${actor}\`\n[🔗 Ver detalles en GitHub Actions](${runUrl})`,
      fields: [
        { name: '🎨 Linter & Formato', value: formatStatus(staticResult), inline: true },
        { name: '🧪 Pruebas Unitarias', value: formatStatus(unitResult), inline: true },
        { name: '🔗 Pruebas Integración', value: formatStatus(integrationResult), inline: true },
        { name: '📦 Production Build', value: formatStatus(buildResult), inline: true },
        { name: '🔍 SonarCloud Gate', value: formatStatus(sonarResult), inline: true }
      ],
      footer: { text: `Task Manager • Reporte Final de CI` },
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
      console.warn(`⚠️ Discord respondió con código de estado: ${res.status}`);
    } else {
      console.log(`✅ [${moduleName}] Notificación consolidada enviada a Discord exitosamente.`);
    }
  })
  .catch(err => {
    console.warn(`⚠️ Error al enviar notificación a Discord: ${err.message}`);
  });

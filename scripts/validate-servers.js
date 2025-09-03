// Simple CI-time validation for public/servers.json
// Accepts either format:
// 1) Array: [{ name, url }]
// 2) Object: { servers: [{ id, name, apiUrl }] }

const fs = require('fs');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function main() {
  const path = 'public/servers.json';
  let raw;
  try {
    raw = fs.readFileSync(path, 'utf8');
  } catch (e) {
    fail(`Validation error: cannot read ${path}: ${e.message}`);
  }
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    fail(`Validation error: ${path} is not valid JSON: ${e.message}`);
  }

  const errors = [];

  if (Array.isArray(data)) {
    data.forEach((s, idx) => {
      const p = `servers[${idx}]`;
      if (!s || typeof s !== 'object') {
        errors.push(`${p} must be an object`);
        return;
      }
      if (typeof s.name !== 'string' || s.name.trim() === '')
        errors.push(`${p}.name must be a non-empty string`);
      if (typeof s.url !== 'string' || s.url.trim() === '')
        errors.push(`${p}.url must be a non-empty string`);
    });
  } else if (data && typeof data === 'object') {
    const servers = data.servers;
    if (!Array.isArray(servers)) {
      errors.push('root.servers must be an array');
    } else {
      const seen = new Set();
      servers.forEach((s, idx) => {
        const p = `servers[${idx}]`;
        if (!s || typeof s !== 'object') {
          errors.push(`${p} must be an object`);
          return;
        }
        if (typeof s.id !== 'string' || s.id.trim() === '')
          errors.push(`${p}.id must be a non-empty string`);
        if (typeof s.name !== 'string' || s.name.trim() === '')
          errors.push(`${p}.name must be a non-empty string`);
        if (typeof s.apiUrl !== 'string' || s.apiUrl.trim() === '')
          errors.push(`${p}.apiUrl must be a non-empty string`);
        if (typeof s.id === 'string') {
          if (seen.has(s.id)) errors.push(`${p}.id duplicates id "${s.id}"`);
          else seen.add(s.id);
        }
      });
    }
  } else {
    errors.push('root must be an array or object');
  }

  if (errors.length) {
    fail(`Invalid public/servers.json:\n- ${errors.join('\n- ')}`);
  }

  console.log('servers.json validation passed');
}

main();


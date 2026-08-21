import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const files = {
  index: await readFile(resolve(root, 'index.html'), 'utf8'),
  contact: await readFile(resolve(root, 'contact-form.html'), 'utf8'),
  script: await readFile(resolve(root, 'assets/main.js'), 'utf8'),
};

const checks = [
  ['contact form exists', files.contact.includes('id="contact-form"')],
  ['contact form has a submit button', files.contact.includes('type="submit"') && files.contact.includes('id="submit-button"')],
  ['contact form exposes a live status region', files.contact.includes('id="form-status"') && files.contact.includes('aria-live="polite"')],
  ['contact form has a configured fallback email', /data-fallback-email="[^"]+@[^\"]+"/.test(files.contact)],
  ['main script uses the configured endpoint', files.script.includes('fetch(endpoint')],
  ['analytics rejects placeholder tracking ids', files.script.includes("this.trackingId.includes('YOUR_')")],
  ['analytics keeps a usable gtag reference', files.script.includes('this.gtag = window.gtag')],
  ['main script has a mail fallback', files.script.includes('window.location.href = mailto')],
  ['contact flow prevents duplicate submissions', files.contact.includes('submitButton.disabled = true') || files.script.includes('submitButton.disabled = true')],
  ['no fake Formspree request remains', !files.contact.includes('fetch(\'https://formspree.io/f/YOUR_FORM_ID\'') && !files.script.includes('fetch(\'https://formspree.io/f/YOUR_FORM_ID\'')],
  ['home page remains non-empty', files.index.length > 1000],
];

const failures = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
}
if (failures.length > 0) {
  process.exitCode = 1;
  console.error(`\n${failures.length} static check(s) failed.`);
} else {
  console.log(`\n${checks.length} static checks passed.`);
}

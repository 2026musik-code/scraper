import { html, raw } from 'hono/html';

const isHls = false;
const res = html`const isHls = ${isHls};`;

console.log(res);

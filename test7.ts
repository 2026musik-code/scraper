import { html } from 'hono/html';
console.log(html`<script>const a = ${JSON.stringify(['foo'])};</script>`.toString());

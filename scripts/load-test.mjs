// Teste de carga simples (sem dependências): node scripts/load-test.mjs <url> <conexões> <segundos>
const [url = "http://localhost:3100/pt", conns = "50", secs = "15"] = process.argv.slice(2);
const end = Date.now() + Number(secs) * 1000;
const lat = [];
let errors = 0;

async function worker() {
  while (Date.now() < end) {
    const t = performance.now();
    try {
      const res = await fetch(url);
      await res.arrayBuffer();
      if (res.status >= 400) errors++;
      lat.push(performance.now() - t);
    } catch {
      errors++;
    }
  }
}

await Promise.all(Array.from({ length: Number(conns) }, worker));
lat.sort((a, b) => a - b);
const q = (p) => lat[Math.min(lat.length - 1, Math.floor(lat.length * p))]?.toFixed(1);
console.log(JSON.stringify({ conns: Number(conns), requests: lat.length, rps: +(lat.length / Number(secs)).toFixed(0), p50: q(0.5), p95: q(0.95), p99: q(0.99), errors }));

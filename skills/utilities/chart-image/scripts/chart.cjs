const fs = require('node:fs');
const path = require('node:path');
function missingBundle() {
  throw new Error("Rebel's built-in document libraries were not found. This is a problem with the Rebel installation, not with your file: report it, and don't try to install packages.");
}
const bundled = require('node:module').createRequire(path.join(process.env.REBEL_BUNDLED_NODE_MODULES || missingBundle(), 'x.js'));

// Draws a Chart.js configuration ({ type, data, options }) to a PNG on a white background.
async function chart(config, output, width = 1200, height = 700) {
  const { createCanvas } = bundled('@napi-rs/canvas');
  const { Chart, registerables } = bundled('chart.js');
  Chart.register(...registerables);
  const canvas = createCanvas(width, height);
  const background = {
    id: 'rebelWhiteBackground',
    beforeDraw: ({ ctx }) => { ctx.save(); ctx.fillStyle = 'white'; ctx.fillRect(0, 0, width, height); ctx.restore(); },
  };
  try {
    new Chart(canvas.getContext('2d'), {
      ...config,
      options: { ...config.options, animation: false, responsive: false },
      plugins: [...(config.plugins ?? []), background],
    });
    fs.writeFileSync(output, await canvas.encode('png'));
  } finally {
    // Also frees a chart whose construction threw after Chart.js registered it.
    Chart.getChart(canvas)?.destroy();
  }
}
module.exports = { chart };
if (require.main === module) {
  const [config, output, width, height] = process.argv.slice(2);
  (async () => {
    const size = [width, height].filter(value => value !== undefined).map(Number);
    if (!config || !output || size.some(value => !Number.isInteger(value) || value < 1)) {
      throw new Error('Usage: chart.cjs chart.json output.png [width height]');
    }
    await chart(JSON.parse(fs.readFileSync(config, 'utf8')), output, ...size);
    console.log(output);
  })().catch(error => { console.error(error.message); process.exitCode = 1; });
}

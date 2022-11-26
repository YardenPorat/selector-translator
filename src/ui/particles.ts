import { tsParticles } from 'tsparticles-engine';
import { loadTrianglesPreset } from 'tsparticles-preset-triangles';

const deepPink = '#ff1493';
const white = '#ffffff';
const black = '#000000';

void (async () => {
    // this is required only if you are not using the bundle script
    await loadTrianglesPreset(tsParticles);

    await tsParticles.load('tsparticles', {
        preset: 'triangles',
        fpsLimit: 75,
        background: { color: black },
        particles: {
            links: {
                distance: 125,
                enable: true,
                // creates triangles between particles
                triangles: {
                    enable: true,
                    opacity: 0.03,
                    // should only have 1 color, or else it flickers
                    color: { value: deepPink },
                },
            },
            move: { speed: 1 },
            size: { value: 1.5 },
            shape: { type: 'circle' },
            // determine density of particles, lower is more dense
            number: { density: { enable: true, value_area: 1400 } },
            color: { value: [white, deepPink] },
        },
    });
})();

const Particles = require('../vendor/particles-2.2.3/particles.min.js');

window.onload = function () {
    // eslint-disable-next-line no-undef
    Particles.init({
        selector: '#background',
        color: ['#DA0463', '#404B69', '#DBEDF3'],
        connectParticles: true,
        maxParticles: 150,
        speed: 0.3,
        responsive: [
            { breakpoint: 1100, options: { maxParticles: 100 } },
            { breakpoint: 768, options: { maxParticles: 100, color: '#48F2E3' } },
            { breakpoint: 530, options: { color: '#48F2E3', maxParticles: 100, connectParticles: false } },
        ],
    });
};

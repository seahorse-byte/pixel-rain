import { useEffect } from "react";
import { imgURLS } from "./imgHelpers";

export default function PixelRain() {
  useEffect(() => {
    const img = new Image();
    img.src = imgURLS.img_1;

    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 700;
    canvas.height = 700;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grd.addColorStop(0, "#61dafb");
    grd.addColorStop(1, "red");
    grd.addColorStop(1, "green");
    grd.addColorStop(1, "pink");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let particles = [];
    const numberOfParticles = 5000;
    let mappedImage = [];

    for (let y = 0; y < canvas.height; y++) {
      let row = [];
      for (let x = 0; x < canvas.width; x++) {
        const red = pixels.data[y * 4 * pixels.width + x * 4];
        const green = pixels.data[y * 4 * pixels.width + (x * 4 + 1)];
        const blue = pixels.data[y * 4 * pixels.width + (x * 4 + 2)];
        const brightness = calculateRelativeBrightness(red, green, blue);
        const cell = [brightness];
        row.push(cell);
      }
      mappedImage.push(row);
    }

    function calculateRelativeBrightness(red, green, blue) {
      return (
        Math.sqrt(
          red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114
        ) / 100
      );
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.speed = 0;
        this.velocity = Math.random() * 2.5;
        this.size = Math.random() * 2.5 + 1;
        this.position1 = Math.floor(this.y);
        this.position2 = Math.floor(this.x);
      }

      update() {
        this.position1 = Math.floor(this.y);
        this.position2 = Math.floor(this.x);
        this.speed = mappedImage[this.position1][this.position2][0];
        let movement = 2.5 - this.speed + this.velocity;
        this.y += movement;
        if (this.y >= canvas.height) {
          this.y = 0;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.beginPath();
        // const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        // grd.addColorStop(0, "red");
        // grd.addColorStop(1, "#61dafb");
        // grd.addColorStop(1, "green");
        // grd.addColorStop(1, "pink");
        // grd.addColorStop(1, "magenta");
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }
    }

    function init() {
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    }
    init();

    function animate() {
      //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.2;
      particles.forEach((_, i) => {
        particles[i].update();
        ctx.globalAlpha = particles[i].speed * 0.5;
        particles[i].draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return (
    <>
      <h2>Pixel rain</h2>
      <canvas></canvas>
    </>
  );
}

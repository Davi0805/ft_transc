const text = "Hello";
const fontSize = 32;
const fontFamily = "Arial";

// Create a visible canvas for debugging
const mainCanvas = document.createElement('canvas');
mainCanvas.width = 300;
mainCanvas.height = 100;
document.body.appendChild(mainCanvas);
const mainCtx = mainCanvas.getContext('2d');

// Measure text
mainCtx.font = `${fontSize}px ${fontFamily}`;
const metrics = mainCtx.measureText(text);
const width = Math.ceil(metrics.width);
const ascent = Math.ceil(metrics.actualBoundingBoxAscent || fontSize);
const descent = Math.ceil(metrics.actualBoundingBoxDescent || 0);
const height = ascent + descent;

// Create offscreen canvas
const offscreen = new OffscreenCanvas(width, height);
//offscreen.width = width;
//offscreen.height = height;
const ctx = offscreen.getContext('2d');
ctx.font = `${fontSize}px ${fontFamily}`;
ctx.fillStyle = "black";
ctx.fillText(text, 0, ascent);

// Draw offscreen canvas onto main canvas
mainCtx.drawImage(offscreen, 10, 10);
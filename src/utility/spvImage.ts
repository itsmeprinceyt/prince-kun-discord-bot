import { createCanvas, registerFont } from "canvas";
import path from "path";

const fontPath = path.join(__dirname, "../public/FONT", "Arial-Bold.ttf");
registerFont(fontPath, { family: "Arial" });

export async function generateSPVImage(spv: number): Promise<Buffer> {
    const width = 100;
    const height = 100;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    const colorStops = [
        { value: 0, color: [139, 69, 19] },    // Brown
        { value: 10, color: [0, 100, 0] },     // Dark Green
        { value: 20, color: [50, 205, 50] },   // Lime Green
        { value: 30, color: [0, 255, 255] },   // Cyan
        { value: 40, color: [0, 0, 255] },     // Blue
        { value: 50, color: [0, 0, 139] },     // Dark Blue
        { value: 60, color: [75, 0, 130] },   // Dark Purple
        { value: 70, color: [147, 112, 219] },// Light Purple
        { value: 80, color: [139, 0, 0] },    // Dark Red
        { value: 90, color: [255, 0, 0] },   // Red
        { value: 100, color: [255, 165, 0] }, // Orange
        { value: 200, color: [255, 255, 0] } // Yellow (Final Color)
    ];

    function getInterpolatedColor(spv: number): string {
        if (spv >= 200) {
            return "rgb(255, 255, 0)";
        }

        for (let i = 0; i < colorStops.length - 1; i++) {
            const start = colorStops[i];
            const end = colorStops[i + 1];

            if (spv >= start.value && spv <= end.value) {
                const factor = (spv - start.value) / (end.value - start.value);
                const r = Math.round(start.color[0] + (end.color[0] - start.color[0]) * factor);
                const g = Math.round(start.color[1] + (end.color[1] - start.color[1]) * factor);
                const b = Math.round(start.color[2] + (end.color[2] - start.color[2]) * factor);
                return `rgb(${r}, ${g}, ${b})`;
            }
        }
        return "rgb(255, 255, 0)";
    }

    const textColor = getInterpolatedColor(spv);
    const fontSize = Math.max(50, Math.min(100, spv / 100));
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(spv.toString(), width / 2, height / 2);
    return canvas.toBuffer("image/png");
}

import { useRef, useEffect } from 'react';
import Vector from '../lib/vector';
import noise from '../lib/perlin';

class FlowField {
    w: number;
    h: number;
    time: number;
    cols: number;
    rows: number;
    field: Vector[][];
    settings: { frequency: number };
    onDraw?: (vector: Vector, x: number, y: number) => void;

    constructor(w: number, h: number, settings = {}) {
        this.settings = { frequency: 1, ...settings };
        this.w = w;
        this.h = h;
        this.time = 0;
        this.field = [];
        this.cols = 0;
        this.rows = 0;
        this.build();
    }

    build() {
        this.cols = Math.ceil(this.w);
        this.rows = Math.ceil(this.h);
        this.field = new Array(this.cols);
        for (let x = 0; x < this.cols; x++) {
            this.field[x] = new Array(this.rows);
            for (let y = 0; y < this.rows; y++) {
                this.field[x][y] = new Vector(0, 0);
            }
        }
    }

    update(delta: number) {
        this.time += delta;
        const updateTime = (this.time * this.settings.frequency) / 1000;
        for (let x = 0; x < this.field.length; x++) {
            for (let y = 0; y < this.field[x].length; y++) {
                const angle = noise.simplex3(x / 20, y / 20, updateTime) * Math.PI * 2;
                const length = noise.simplex3(x / 10 + 40000, y / 10 + 40000, updateTime);
                this.field[x][y].setAngle(angle);
                this.field[x][y].setLength(length);

                if (typeof this.onDraw === 'function') {
                    this.onDraw(this.field[x][y], x, y);
                }
            }
        }
    }
}

type RGBColor = { r: number; g: number; b: number };

const FlowfieldAnimation = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const container = canvas.parentElement;
        if (!container) return;

        let animationFrameId: number;

        const setupAndRun = () => {
            const colors = {
                paper: { r: 248, g: 244, b: 236 },
                softPink: { r: 200, g: 138, b: 154 },
                oliveGreen: { r: 112, g: 120, b: 101 },
                lightBeige: { r: 212, g: 196, b: 177 },
                lightBlue: { r: 173, g: 202, b: 230 },
            };

            const settings = { frequency: 0.1 };
            const tileSize = 40;
            const tileRatio = 1;

            const box = container.getBoundingClientRect();
            canvas.width = box.width;
            canvas.height = box.height;

            const cols = Math.ceil(canvas.width / tileSize);
            const rows = Math.ceil(canvas.height / (tileSize * tileRatio));
            const ctxScale = { x: canvas.width / cols, y: canvas.height / rows };

            const ff = new FlowField(cols, rows, settings);

            const lerpColor = (c1: RGBColor, c2: RGBColor, f: number): RGBColor => ({
                r: Math.round(c1.r + f * (c2.r - c1.r)),
                g: Math.round(c1.g + f * (c2.g - c1.g)),
                b: Math.round(c1.b + f * (c2.b - c1.b)),
            });

            const smoothstep = (min: number, max: number, value: number) => {
                const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
                return x * x * (3 - 2 * x);
            };

            ff.onDraw = (vector, x, y) => {
                if (x === 0 && y === 0) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
                const xmove = vector.getLength() * Math.abs(vector.x);
                const ymove = vector.getLength() * Math.abs(vector.y);
                const vectorMagnitude = xmove * xmove + ymove * ymove;
                const vectorFactor = smoothstep(0.3, 0.7, vectorMagnitude);

                const colorNoise = noise.simplex3(x / 30, y / 30, ff.time * 0.0002);

                const baseColor = lerpColor(colors.paper, colors.lightBeige, smoothstep(0.2, 0.5, ymove));
                let finalColor = lerpColor(baseColor, colors.oliveGreen, smoothstep(0.4, 0.7, xmove) * 0.5);
                
                if (vectorFactor > 0.1) {
                    if (colorNoise > 0) {
                        finalColor = lerpColor(finalColor, colors.softPink, colorNoise * vectorFactor);
                    } else {
                        finalColor = lerpColor(finalColor, colors.lightBlue, -colorNoise * vectorFactor);
                    }
                }
                
                ctx.fillStyle = `rgba(${finalColor.r}, ${finalColor.g}, ${finalColor.b}, 0.95)`;
                ctx.fillRect(x * ctxScale.x, y * ctxScale.y, ctxScale.x, ctxScale.y);
            };

            let lastStep = 0;
            const step = (time: number) => {
                ff.update(time - lastStep || 0);
                lastStep = time;
                animationFrameId = window.requestAnimationFrame(step);
            };
            step(0);
        };
        
        setupAndRun();
        const resizeObserver = new ResizeObserver(() => setupAndRun());
        resizeObserver.observe(container);
        
        return () => {
            window.cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };
    }, []);

    return <canvas ref={canvasRef} className="flowfield-canvas" />;
};

export default FlowfieldAnimation;
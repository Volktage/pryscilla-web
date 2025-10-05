export default class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(v: Vector): Vector {
        return new Vector(
            this.x + v.x,
            this.y + v.y);
    }

    addTo(v: Vector): void {
        this.x += v.x;
        this.y += v.y;
    }

    sub(v: Vector): Vector {
        return new Vector(
            this.x - v.x,
            this.y - v.y);
    }

    subFrom(v: Vector): void {
        this.x -= v.x;
        this.y -= v.y;
    }

    mult(n: number): Vector {
        return new Vector(this.x * n, this.y * n);
    }

    multTo(n: number): void {
        this.x *= n;
        this.y *= n;
    }

    div(n: number): Vector {
        return new Vector(this.x / n, this.y / n);
    }

    setAngle(angle: number): void {
        const length = this.getLength();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    setLength(length: number): void {
        const angle = this.getAngle();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    getAngle(): number {
        return Math.atan2(this.y, this.x);
    }

    getLength(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    getLengthSq(): number {
        return this.x * this.x + this.y * this.y;
    }

    distanceTo(v: Vector): number {
        return this.sub(v).getLength();
    }

    copy(): Vector {
        return new Vector(this.x, this.y);
    }
}
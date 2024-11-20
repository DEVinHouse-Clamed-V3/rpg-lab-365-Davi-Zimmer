export interface RectProps {
    x: number
    y: number
    w: number
    h: number
}

export class Rect {
    public x
    public y
    public w
    public h
    
    constructor({x=0, y=0, w=0, h=0}:RectProps){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    /*
    fill( ctx:CanvasRenderingContext2D, color:string ){
        ctx.fillStyle = color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    */
}

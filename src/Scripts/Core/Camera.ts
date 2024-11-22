import { BaseObject } from "../Bases/ObjectBase.js"
import { Rect } from "../Bases/Rect.js"

export class Camera {
    public x:number
    public y:number
    public zoom: number

    constructor(x:number, y:number, zoom:number){
        this.x = x
        this.y = y
        this.zoom = zoom
    }

    clamp(current:number, min:number, max:number){
        return Math.min( Math.max( current, min ), max)
    }

    calcCoords({ x, y, w, h } : Rect){
        return [
            x * this.zoom - this.x * this.zoom,
            y * this.zoom - this.y * this.zoom,
            w * this.zoom, 
            h * this.zoom, 
        ]
    }

    tick( target: BaseObject, {width, height}: HTMLCanvasElement, [maxMapW, maxMapH]:Array<number>){

        const newX = (target.x + target.w / 2) - (width  / 2) / this.zoom
        const newY = (target.y + target.h / 2) - (height / 2) / this.zoom

        this.x = this.clamp( newX, 0, maxMapW * this.zoom )
        this.y = this.clamp( newY, 0, maxMapH * this.zoom )
    }

    /// criar metodo de perseguição pro player aqui

}
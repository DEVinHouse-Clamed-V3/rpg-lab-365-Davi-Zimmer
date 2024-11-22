import { Rect, RectProps } from "../Bases/Rect.js";
import { Camera } from "../Core/Camera.js";

export interface ItemProps extends RectProps {
    name: string
    description: string
}

export class Item extends Rect {
    private deltaY:number = 0
    private sprite: Array<number>

    private name: string = ''
    private description: string = ''

    constructor({ x, y, w, h, name, description }:ItemProps){

        super({ x, y, w, h, type:"Item" })

        this.sprite = [0, 0, 20, 37]
        
        this.setName( name )
        this.setDescription(description)
    }

    getName() { return this.name }
    getDescription(){ return this.description }

    setName( name:string ) { this.name = name }
    setDescription( desciption:string ){ this.description = desciption }

    tick(){
        this.deltaY++
    }

    renderSprite( ctx : CanvasRenderingContext2D, cam : Camera, spriteSize:number, spriteSheet:HTMLImageElement){

        const [ x, y, w, h ] = cam.calcCoords( this ).map( n => n *= spriteSize)

        const [ sx, sy, sw, sh ] = this.sprite

        // calcula os pecados que pesarão acima do item...
        const delta = Math.sin(this.deltaY)

        ctx.drawImage(spriteSheet, sx, sy, sw, sh, x, y + delta, w, h )
    }

    render( ctx : CanvasRenderingContext2D, cam : Camera, spriteSize:number, spriteSheet:HTMLImageElement ){
        this.renderSprite( ctx, cam, spriteSize, spriteSheet)

    }

}
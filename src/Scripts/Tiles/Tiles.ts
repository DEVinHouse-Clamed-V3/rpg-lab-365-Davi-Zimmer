import { Rect, RectProps } from "../Bases/Rect.js"

export interface TileProps extends RectProps {
    type: string
    solid?: boolean
    layer: number
}

export class Tile extends Rect{
    public type
    public layer

    constructor( props : TileProps ){
        super( props )
        
        this.type = props.type
        this.layer = props.layer || 2
    }

    render( ctx : CanvasRenderingContext2D ){

        ctx.fillStyle = 'blue'

        ctx.fillRect( this.x, this.y, this.w, this.h )

    }
}
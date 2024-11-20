import { Rect, RectProps } from "../Bases/Rect.js"


export interface EntityProps extends RectProps {
    life: number
    type: string

    //sprites: SpriteProps
    //spriteSheet: HTMLImageElement
    //spriteStatus?: string

}

export class Entity extends Rect {
    private life
    private type 

    //private entitySprites: Record<string, Array<number>>
    private animation = 'idle'

    private currentFrame = 0
    private maxFrames = 0
    private currentFrameDelay = 0
    private maxFrameDelay = 0
    //private spriteSheet

    constructor( props : EntityProps ){
        super( props )

        this.life = props.life
        // this.animation = props.spriteStatus || 'idle'
        this.type = props.type
        //this.changeAnimation('idle')
        
        /*
        this.spriteSheet = props.spriteSheet
        props.sprites.forEach(spr => {
            this.entitySprites[ spr.name ] = spr.position
        });
        */
    }

    /*
    changeAnimation( animationName:string ){
        const frames = this.sprites[ animationName ]

        if( !frames ){
            return
        }

        this.maxFrames = frames.length

    }
    getCurrentAnimation(){
        return this.sprites[ this.animation ]
    }
    */

    tick(){
        /*
        if( this.currentFrameDelay > this.maxFrameDelay ){
            this.currentFrameDelay = 0
            this.currentFrame++

            if( this.currentFrame > this.maxFrames){
                this.currentFrame = 0
            }

        }

        this.currentFrameDelay++
        */

    }

    render( ctx : CanvasRenderingContext2D ){
        /*
        const animation = this.getCurrentAnimation()

        const [dx, dy, dw, dh] = animation[this.currentFrame]

        const img = this.spriteSheet

        ctx.drawImage(img, dx, dy, dw, dh, this.x, this.y, this.w, this.h,)
        */
    }


}
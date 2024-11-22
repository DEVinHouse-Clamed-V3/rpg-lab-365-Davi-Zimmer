import { BaseObject, BaseObjectProps } from "../Bases/ObjectBase.js"
import { Camera } from "../Core/Camera.js"
import { Tile } from "../Tiles/Tiles.js"

export interface EntityProps extends BaseObjectProps {
    life: number
    speed: number
    type: string
    zindex?: number
    classType?: string
    orientation?: Array<number>
    //sprites: SpriteProps
    //spriteSheet: HTMLImageElement
    //spriteStatus?: string

}

export class Entity extends BaseObject {
    private life

    //private entitySprites: Record<string, Array<number>>
    public animationName = 'idle'
    public animationFrame = 0
    public maxFrames = 0
    public currentFrameDelay = 0
    public maxFrameDelay = 7
    public sprites:Record<string, Array<Array<number>>>
    
    //private spriteSheet
    public orientation: Array<number> = [0, 0]
    public canMove = true
    public speed: number
    public invertedSprite:boolean = false

    constructor( props : EntityProps ){
        
        props.classType = props.classType || "entity"

        if( !props.zindex ) props.zindex = 2

        super( props )
        this.speed = props.speed
        this.life = props.life

        this.sprites = {
            idle: [[0, 0, 20, 37]]            
        }

        // this.animation = props.spriteStatus || 'idle'
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

    getCollisionMask(){
        this.updateCollisionMask()

        const { x, y, w, h } = this.collisionMask
        const [ dx, dy ] = this.orientation

        return {x: x + dx, y: y + dy, w, h}
    }

    // getNextCollisionMask() {}

    updateAnimation(){
        //console.log(this.currentFrameDelay)

        if( this.currentFrameDelay > this.maxFrameDelay ){
            this.currentFrameDelay = 0
            this.animationFrame++

            if( this.animationFrame > this.maxFrames){
                this.animationFrame = 0
            }

        }

        this.currentFrameDelay++
    }

    changeAnimation( animationName:string ){
        const animation = this.sprites[ animationName ]
        
        this.animationName = animationName
        
        this.maxFrames = animation.length - 1

        // evita pegar uma animação pelo index maior que a animação anterior
        this.animationFrame = Math.min( this.maxFrames, this.animationFrame )

    }

    getCurrentAnimationFrame( ){
        const currentAnimation = this.animationName
        const spriteList = this.sprites[ currentAnimation ]

        const frame = spriteList[ this.animationFrame ]

        return frame

    }

    getSpriteToRenter(x:number, y:number, w:number, h:number){

        return (spriteSheet:HTMLImageElement, ctx:CanvasRenderingContext2D, spriteSize:number ) => {
            const [ sx, sy, sw, sh ] = this.getCurrentAnimationFrame().map( n => n *= spriteSize)

       
            if (this.invertedSprite) {
                ctx.save(); // Salvar o estado do contexto
                ctx.scale(-1, 1); // Escalar negativamente no eixo X
                ctx.drawImage(spriteSheet, sx, sy, sw, sh, -x, y, -w, h);
                ctx.restore();
        
            }
            else {
                ctx.drawImage(spriteSheet, sx, sy, sw, sh, x, y, w, h);
            }
        }
       
    }


    tick( collider: Function ){
        this.updateAnimation()
    }

    render( ctx : CanvasRenderingContext2D, cam : Camera, spriteSize:number, spriteSheet:HTMLImageElement){
        /*
        const animation = this.getCurrentAnimation()

        const [dx, dy, dw, dh] = animation[this.currentFrame]

        const img = this.spriteSheet

        ctx.drawImage(img, dx, dy, dw, dh, this.x, this.y, this.w, this.h,)
        */

        const [ x, y, w, h ] = cam.calcCoords( this )

        ctx.fillStyle = 'blue'
        ctx.fillRect(x,y,w,h)
    }


}
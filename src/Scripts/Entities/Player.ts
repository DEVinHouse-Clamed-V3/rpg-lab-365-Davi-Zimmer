import { BaseObject } from "../Bases/ObjectBase.js"
import { Camera } from "../Core/Camera.js"
import { Entity, EntityProps} from "./Entity.js"

export interface PlayerProps extends EntityProps {
}

export class Player extends Entity {
    private acceptedKeys: Record<string, Function> = {}
    private keysToExecute: Record<string, Function> = {}
    private onAir:boolean = false
    public canMove:boolean = true
    public direction: Array<number> = [0, 0]
    private jumps:number = 3

    constructor( props : PlayerProps ){

        if( !props.zindex ) props.zindex = 2

        super( props )

        // this.speed = props.speed

        this.acceptedKeys = {
            a: () => { this.direction[0] = -this.speed; this.invertedSprite = false},
            d: () => { this.direction[0] =  this.speed; this.invertedSprite = true},
            w: () => { this.direction[1] = -this.speed },
            s: () => { this.direction[1] =  this.speed },

            space: () => {
                this.onAir = true,
                this.jumps--
                if( this.jumps >= 0 ) this.orientation = [0, -30]

                return true
            },
        }

        this.sprites = {
            idle: [[0, 0, 20, 37]],
            running: [
                [44, 0, 21, 37],
                [44, 0, 21, 37],
                [66, 0, 21, 37],
                [88, 0, 21, 37],
            ],
            
        }

        this.changeAnimation("running")

    }

    getKeyEvents(){
        
        return {
            acceptedKeys: this.acceptedKeys,
            keysToExecute: this.keysToExecute
        }

    }

    movementAndCollision( collider: Function ){

        // quando o player bate na quina de algum bloco, ele fica preso.
        // não sei porq ue isso acontece, mas acho que vou deixar como fature

        const [dx, dy] = this.direction

        const testX = this.x + dx + this.orientation[ 0 ]
        const testY = this.y + dy + this.orientation[ 1 ]

        // collider retorna a lista de itens em colisão com esta classe
        // seria bom otimizar isso.
        const collisionsX = collider({x: testX , y:this.y, w:this.w, h:this.h, self:this})
        const collisionsY = collider({x: this.x, y:testY , w:this.w, h:this.h, self:this})

        // atualização de movimento do player por frame
        if( !collisionsX[0] ) {

            this.x += dx + this.orientation[ 0 ]

        } 
        else this.orientation[0] = 0


        if( !collisionsY[0] ) {

            this.y += dy + this.orientation[ 1 ]
        }
        else {
            
            this.orientation[1] = 0

            // isso evita que o player seja teleportado para o tyle a cima dele
            if( collisionsY[0].y > this.y){
                // faz a colisão ser perfeita no chão
                this.y = collisionsY[0].y - this.h
            }

        }

        // reseta a direção, se n ele fica andando infinitamente
        this.direction = [0, 0]


        // chão e gravidade
        
        const ground = collisionsY.some( (item:BaseObject) => item.type == 'Ground' && item.y > this.y )
        
        if( !ground ){
            
            const againstForce = -1

            this.orientation[ 1 ] -= againstForce

            this.onAir = true
            
        } else {

            this.onAir = false

            this.jumps = 3

        }
    }

    tick( collider: Function ){
        
        if( this.canMove ) this.movementAndCollision( collider )

        this.updateAnimation()
    }

    render(ctx: CanvasRenderingContext2D, cam : Camera, spriteSize:number, spriteSheet:HTMLImageElement) {
        ctx.fillStyle = 'red'
        
        let [x, y, w, h] = cam.calcCoords( this )

        // adiciona a posição das variaveis de velocidade pra evitar um bug visual
        if( this.canMove ){
            x -= (this.orientation[ 0 ] - this.direction[ 0 ]) * cam.zoom
            y -= (this.orientation[ 1 ] - this.direction[ 1 ]) * cam.zoom
        }
        
        const renderSprite = this.getSpriteToRenter(x, y, w, h)
       
        renderSprite(spriteSheet, ctx, spriteSize)


        //ctx.fillRect(x, y, w, h)
    }

}
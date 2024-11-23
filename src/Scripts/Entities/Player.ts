import { BaseObject } from "../Bases/ObjectBase.js"
import { Camera } from "../Core/Camera.js"
import { Weapon } from "../Itens/Weapon.js"
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

    private name:string = ''
    private force:number = 0
    private weapon:Weapon | null = null

    constructor( props : PlayerProps ){

        if( !props.zindex ) props.zindex = 2

        super( props )

        // this.speed = props.speed

        this.acceptedKeys = {
            a: () => { this.direction[0] = -this.speed; this.invertedSprite = false},
            d: () => { this.direction[0] =  this.speed; this.invertedSprite = true},
            w: () => { this.direction[1] = -this.speed },
            s: () => { this.direction[1] =  this.speed },
            numpadsubtract: () => {
                this.getDamage(50)

                return true
            },

            space: () => {
                this.onAir = true,
                this.jumps--
                if( this.jumps >= 0 ) this.orientation = [0, -30]; else {
                    this.setLife(0)
                }

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
        const gravity = 1

        const testX = this.x + dx + this.orientation[ 0 ]
        const testY = this.y + dy + this.orientation[ 1 ] + gravity

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
        // ps descobri que isso fica alternando entre true/false quando no chão em vez de apenas 
        const ground = collisionsY.some( (item:BaseObject) => item.type == 'Ground' && item.y > this.y + 10 )
        
        if( !ground ){

            this.orientation[ 1 ] += gravity

            this.onAir = true
            
        } else {

            this.onAir = false

            this.jumps = 3

        }
    }

    atack( target:Entity ){

        if( !this.weapon ) return

        const damage = this.getForce() + this.weapon.getDamage()

        if(Math.floor(Math.random() * 10) == 1){
            //miss
            this.missAtack()
            return
        }

        target.getDamage( damage )

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

        this.posRender( ctx, [x, y, w, h])

        //ctx.fillRect(x, y, w, h)
    }

    getName(){ return this.name }
    setName( name:string ) { this.name = name }


    getForce(){ return this.force }
    setForce(force:number){ this.force = force}

    getWeapon(){ return this.weapon }
    setWeapon(weapon:Weapon){ this.weapon = weapon}


    // get(){ return this. }
    // set(:){ this. =}


}
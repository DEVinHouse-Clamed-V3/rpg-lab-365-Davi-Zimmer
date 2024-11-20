import { Entity, EntityProps} from "./Entity.js"


export interface PlayerProps extends EntityProps {
    speed: number
}

export class Player extends Entity {
    private acceptedKeys: Record<string, Function> = {}
    private keysToExecute: Record<string, Function> = {}
    private orientation: Array<number> = [0, 0]
    private onAir:boolean = false
    private speed:number

    constructor( props : PlayerProps ){
        super( props )

        this.speed = props.speed

        this.acceptedKeys = {
            a: () => this.x -= this.speed,
            d: () => this.x += this.speed,
            space: () => {
                this.onAir = true,
                this.orientation = [0, 10]
            },
        }
    }

    getKeyEvents(){
        
        return {
            acceptedKeys: this.acceptedKeys,
            keysToExecute: this.keysToExecute
        }

    }

    tick(){

        const [dx, dy] = this.orientation

        this.x += dx
        this.y += dy

        // checar se tem chão em baixo do player

        if( this.onAir ){
            const againstForce = .5

            this.orientation[1] = Math.max(0, dy - againstForce)
                
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
}
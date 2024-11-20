import { Interface } from "./Interface.js"
import { Rect } from "../Bases/Rect.js"

export class UIManager {
    private currentInterface : Interface | null = null
    private gameWindow: Rect
    public interfaces: Array<Interface> = []
    public transitionRunning: ((ctx:CanvasRenderingContext2D, color:string) => void) | null = null

    constructor( props : Rect ){

        this.gameWindow = props

            this.transition()
    }

    transition(){
        const { x, y, w, h } = this.gameWindow 
        const blocksSize = 50

        const relativeW = w / blocksSize
        const relativeH = h / blocksSize

        const blocks:Array<Array<Array<number>>> = []

        let time = 10

        for(let x = 0; x < relativeW; x++ ){
            blocks.push([])

            for(let y = 0; y < relativeH; y++ ){
                blocks[x].push( [x, y, blocksSize ])
            }
        }

        let orientation = 1

        let size = blocksSize

        this.transitionRunning = function Animate( ctx: CanvasRenderingContext2D, color:string = 'blue'){
        

            if( time > 0 || time < 100){
                time += .1
            }

            
            size -= Math.cos( time ) * 4 // 2 * this.orientation

            // menor numero absoluto é 0.06263412436859372
            
            for(let xx = 0; xx < blocks[0].length; xx++ ){

                for(let yy = 0; yy < blocks.length; yy++ ){
                    
                    const [blockX, blockY] = blocks[yy][xx]
                    
                    const xmiddle = ((blockX * blocksSize) - size / 2) + blocksSize / 2
                    const ymiddle = ((blockY * blocksSize) - size / 2) + blocksSize / 2
                    
                    ctx.fillStyle = color
                    ctx.fillRect(xmiddle, ymiddle, size, size)
                
                }
                
            }

        }

    }

    addInterface( _interface: Interface ){
        this.interfaces.push( _interface )
    }

    changeInterface( _interface:Interface, transitionEnabled: boolean ){
        if( transitionEnabled ){
            this.transition()
        }
    }

}
import { Sprites } from "../Visual/Sprites.js"
import { Rect, RectProps } from "../Bases/Rect.js"
import { Entity, EntityProps} from "../Entities/Entity.js"
import { Player } from "../Entities/Player.js"
import { UIManager } from "../Interfaces/UIManager.js"

class Game {
    private pause:boolean = false
    private ctx: CanvasRenderingContext2D | null = null

    // por algum motivo os eventos dizem que não existe os objetos 
    private eventTarget: null | Game | Player = null 
    private acceptedKeys: Record<string, Function> = {}
    private keysToExecute: Record<string, Function> = {}
    private gameWindow: Rect = new Rect({x:0,y:0,w:0,h:0})
    private sprites: Sprites | null = null
    private spriteSheet: HTMLImageElement | null = null
    private uiManager: any | null = null
    private entities: Array< Entity > = []
    private map: Array<any> = []

    constructor(){

        // criar uma animação de loading aqui
        Sprites.GetSpriteSheet('../Assets/SpriteSheet.png')
        .then( img => {

            this.spriteSheet = img

            this.initialize()

        }).catch(e => {
            console.log(e )
            //alert('Não foi possível carregar os sprites do jogo.')
        })

        
    }

    static GetContext(){
        let canvas = document.querySelector('canvas')

        if( !canvas ){

            canvas = document.createElement('canvas')

            document.body.appendChild( canvas )

        }
        
        canvas.width = innerWidth
        canvas.height = innerHeight
        
        return canvas.getContext('2d')!

    }

    static Loop( self : Game ){
        const {update, pause, ctx} = self

        if( !ctx ) return        

        return function loop() {
            
            if( !pause ){

                update( ctx , self )

            }

            requestAnimationFrame( loop )
        }
    }

    static GetEvents( canvas: HTMLCanvasElement ){
        
        const lower = ( e : KeyboardEvent ) => e.key.toLowerCase()

        type funcKeyProp = (key: string) => void

        type funcMouseProp = (e: MouseEvent) => void

        function keydown( func : funcKeyProp  ){
            canvas.addEventListener('keydown', e => {
                const key = lower( e )
                func( key )
            })
        }

        function keyup( func : funcKeyProp  ){
            canvas.addEventListener('keyup', e => {
                const key = lower( e )
                func( key )
            })
        }

        function mousemove ( func: funcMouseProp ){
            canvas.addEventListener('mousemove', e => func( e ))
        }

        function mousedown( func: funcMouseProp ){
            canvas.addEventListener('mousedown', e => func( e ))
        }

        canvas.addEventListener('contextmenu', e => e.preventDefault())

        return {
            keydown,
            keyup,
            mousemove,
            mousedown
        }
        
    }

    getKeyEvents(){
        return {
            acceptedKeys: this.acceptedKeys,
            keysToExecute: this.keysToExecute
        }
    }

    initialize (){
        // declarations 
        this.ctx = Game.GetContext()

        const canvas = this.ctx.canvas

        const loop = Game.Loop( this )   

        const border = 30

        this.gameWindow = new Rect({
            w: canvas.width,
            h: canvas.height,
            x: border,
            y: border
        })

        this.eventTarget = this

        this.acceptedKeys = {
            w: () => console.log('w'),
        }
    
        // events
        const events = Game.GetEvents( canvas )

        events.keydown( (key) => {

            if( !this.eventTarget) return

            const {acceptedKeys, keysToExecute} = this.eventTarget.getKeyEvents()

            
            const func = acceptedKeys[ key ]
            
            if( func ){
                keysToExecute[ key ] = func
            }

        })

        events.keyup( key => {
    
            delete this.eventTarget?.getKeyEvents()?.keysToExecute[ key ]
        })

        events.mousedown( e => {
            console.log( e.button )
        })

        loop?.()

        this.startGameThings()
    }

    startGameThings(){
        
        this.uiManager = new UIManager( this.gameWindow )

        // const playerSprites = this.sprites?.GetSpritesByName('player')

        const player = new Player({
            x: 100, y: 100, w: 100, h: 100,
            life: 100, type: 'player',
            speed: 10
        })

        this.entities.push( player )
        this.eventTarget = player

    }

    update( ctx : CanvasRenderingContext2D, self: Game ){
        // Tick
        if(self.eventTarget){
            const { keysToExecute } = self.eventTarget.getKeyEvents()
            
            for( const key in keysToExecute ){
                const func =  keysToExecute[ key ]
                
                func()
            }
        }

        // Render
        const canvas = ctx.canvas

        // limpa toda a tela
        ctx.fillStyle = '#323232'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // essa é a tela do jogo em si
        ctx.fillStyle = 'black'
        
        const { x, y, w, h } = self.gameWindow

        ctx.fillRect(x, y, w-x*2, h-y*2)


        self.entities.forEach( entity => {
            entity.tick()
            entity.render( ctx )
        })

        return

        self.uiManager.transitionRunning?.( ctx,'blue' )

    }

}

const game = new Game()


// ola() era pra fazer o log "Oiee"

// import ola from "./Sprites"
// console.log( ola() )
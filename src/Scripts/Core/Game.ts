import { Sprites } from "../Visual/Sprites.js"
import { BaseObject as Rect, BaseObjectProps } from "../Bases/ObjectBase.js"
import { Entity, EntityProps} from "../Entities/Entity.js"
import { Player } from "../Entities/Player.js"
import { Camera } from "./Camera.js"
import { MapMatix } from "../Map/MapMatrix.js"
import { MapTiles } from "../Map/MapTiles.js"
import { Tile } from "../Tiles/Tiles.js"
import { UIManager } from "../Interfaces/UIManager.js"
/*
const map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, ],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, ],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, ],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ]
]*/

const map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
]


class Game {
    private pause:boolean = false
    private ctx: CanvasRenderingContext2D | null = null

    // por algum motivo os eventos dizem que não existe os objetos 
    private eventTarget: null | Game | Player = null 
    private acceptedKeys: Record<string, Function> = {}
    private keysToExecute: Record<string, Function> = {}
    private gameWindow: Rect = new Rect({x:0,y:0,w:0,h:0})
    private sprites: Sprites | null = null
    private spriteSheet: HTMLImageElement = new Image()
    private uiManager: UIManager | null = null
    private entities: Array< Entity > = []
    private camera:Camera = new Camera(0, 0, 1)
    private map: MapTiles = new MapTiles( 10, 2, 100, map )
    private cameraTarget: Rect | null = null
    private spriteSize:number = 10

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

        canvas.focus()

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
        
        const lower = ( e : KeyboardEvent ) => e.code.toLowerCase().replace('key', '')

        type funcKeyProp = (key: string) => void

        type funcMouseProp = (e: MouseEvent) => void

        type funcWheelProp = (e: WheelEvent) => void

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

        function wheel( func: funcWheelProp ){
            canvas.addEventListener('wheel', e => func( e ))
        }

        canvas.addEventListener('contextmenu', e => e.preventDefault())

        return {
            keydown,
            keyup,
            mousemove,
            mousedown,
            wheel
        }
        
    }

    static IsInside( a:Record<string, number>, b:Record<string, number> ){

        return (   
            a.x + a.w > b.x && // left
            b.x + b.w > a.x && // right
            a.y + a.h > b.y && // top
            b.y + b.h > a.y    // bottom
        )

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

        this.ctx.imageSmoothingEnabled = false

        const loop = Game.Loop( this )   

        const border = 30

        this.gameWindow = new Rect({
            w: canvas.width,
            h: canvas.height,
            x: 0,// border,
            y: 0,// border
        })

        this.eventTarget = this

        this.acceptedKeys = {
            // w: () => console.log('w'),
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
            this.uiManager?.clickEvent( e )
        })


        events.wheel( e => {
            const delta = e.deltaY / 1000

            this.camera.zoom = Math.max(.1, this.camera.zoom - delta)
        }) 

        loop?.()

        this.startGameThings()
    }

    startGameThings(){
        
        this.uiManager = new UIManager({
            gameWindow: this.gameWindow,
            isInside: Game.IsInside
        })

        this.uiManager.createInterface()

        // const playerSprites = this.sprites?.GetSpritesByName('player')

        const player = new Player({
            x: 0, y: -100, w: 100, h: 100,
            life: 100, type: 'player',
            speed: 10,
            zindex: 10
        })

        const entity = new Entity({
            x: 200, y: 100, w: 100, h: 100,
            life: 100, type: 'any',
            speed: 10,

        })

        this.entities.push( entity )
        this.entities.push( player )

        this.cameraTarget = player
        this.eventTarget = player
    }

    collision( caller:Rect | Record<string, number>, b:Rect ){

        if( caller === b || caller.self == b) return false

        const bMask = b.getCollisionMask()

        const isTile = (caller.classType != 'Tile' || b.classType != 'Tile')

        const zCollision = caller.zindex != b.zindex

        const collision = Game.IsInside(caller as Record<string, number>, bMask)

        return collision && isTile && zCollision

    }

    getMapSize(){
        const tileSize = this.map.tileSize
        const a = this.map.map.length-1
        const b = this.map.map[a].length-1

        const lastTile = this.map.map[a][b]
        // console.log( lastTile )

        return [
           ( lastTile.x + lastTile.w ),
           ( lastTile.y + lastTile.h )
        ]
    }

    isInCameraRange( rect : Rect, {width, height}:HTMLCanvasElement){

        const bonus = 100
        const cam = this.camera
        const z = cam.zoom

        const camObj  =  {
            x: (cam.x - bonus) * z,
            y: (cam.y - bonus) * z,
            w: width  + bonus * 2 * z,
            h: height + bonus * 2 * z
        }

        const item =  {
            x:rect.x * z,
            y:rect.y * z,
            w:rect.w * z,
            h:rect.h * z
        }
        
        const inCamera = Game.IsInside( item, camObj )

        return inCamera

    }

    update( ctx : CanvasRenderingContext2D, self: Game ){
        // Tick
        const cam = self.camera
        const canvas = ctx.canvas

        if(self.eventTarget){
            const { keysToExecute } = self.eventTarget.getKeyEvents()
            
            for( const key in keysToExecute ){
                const func =  keysToExecute[ key ]
                func() ? delete  keysToExecute[ key ] : null 
                
            }
        }

        if( self.cameraTarget ){
            cam.tick( self.cameraTarget, canvas, self.getMapSize() )
        }

        // Render

        // limpa toda a tela
        //ctx.fillStyle = '#323232'
        //ctx.fillRect(0, 0, canvas.width, canvas.height)

        // essa é a tela do jogo em si
        ctx.fillStyle = 'rgba(0, 0, 0, 1)'

        
        const { x, y, w, h } = self.gameWindow

        ctx.fillRect(x, y, w-x*2, h-y*2)
   
        const renderable = [...self.entities, ...self.map.getTiles()].filter( item => self.isInCameraRange( item, canvas))

        const renderableOrder = renderable.sort( 
            ( itemA: Rect, itemB: Rect) => itemA.zindex - itemB.zindex )
 
        renderableOrder.forEach( item => {
            
            if( item instanceof Entity ){

                if( item.getLife() <= 0 ) {
                    item.die()
                    return
                }

                const collider = ( e:Rect ) => renderable.filter(elm => self.collision( e, elm ))

                item.tick( collider )
                
            }

            item.render( ctx, cam, self.spriteSize, self.spriteSheet )

        })


        // self.uiManager?.currentInterface?.render( ctx )


        return
        // self.uiManager.transitionRunning?.( ctx,'blue' )

    }

}

const game = new Game()


/*
const map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
]
    
*/
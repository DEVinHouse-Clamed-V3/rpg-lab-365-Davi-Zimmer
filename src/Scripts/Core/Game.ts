import { Sprites } from "../Visual/Sprites.js"
import { BaseObject as Rect, BaseObjectProps } from "../Bases/ObjectBase.js"
import { Entity, EntityProps} from "../Entities/Entity.js"
import { Player } from "../Entities/Player.js"
import { Camera } from "./Camera.js"
import { MapMatix } from "../Map/MapMatrix.js"
import { MapTiles } from "../Map/MapTiles.js"
import { Tile } from "../Tiles/Tiles.js"
import { UIManager } from "../Interfaces/UIManager.js"
import { Enemy } from "../Entities/Enemy.js"
import { Projectile } from "../Projectile/Projectile.js"
import { GameMap } from "../Map/GameMap.js"
import { Boss } from "../Entities/Boss.js"
import { Item } from "../Itens/Item.js"
import { Life } from "../Itens/Life.js"

const map = GameMap

class Game {
    private score: number = 0
    private pause:boolean = false
    private ctx: CanvasRenderingContext2D | null = null

    private eventTarget: null | Game | Player = null 
    private acceptedKeys: Record<string, Function> = {}
    private keysToExecute: Record<string, Function> = {}
    
    private spriteSheet: HTMLImageElement = new Image()
    private spriteSize:number = 10
    
    private items: Array<Item> = []
    private entities: Array< Entity > = []
    private projectiles: Array< Projectile > = []
    
    private uiManager: UIManager | null = null
    private gameWindow: Rect = new Rect({x:0,y:0,w:0,h:0})
    private camera:Camera = new Camera(0, 0, 1)
    private map: MapTiles = new MapTiles( 10, 2, 100, map )
    private cameraTarget: Rect | null = null
    private Boss:Boss =  new Boss({
        life: 7800,
        speed: 0,
        type: "Boss",
        zindex: -10,
        createElement: (elm:Entity) => this.createElement( elm ),
        score: {
            getScore: () =>  this.getScore( this ),
            setScore: (s:number) =>  this.setScore( this, s )
        },
        cam: this.camera
    })

    constructor(){

        // criar uma animação de loading aqui
        Sprites.GetSpriteSheet('../Assets/SpriteSheet.png')
        .then( img => {

            this.spriteSheet = img

            this.initialize()

        }).catch(e => {
            console.warn( e )
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

    createElement( elm:Entity | Projectile | Item ){

        if( elm instanceof Entity ){
            this.entities.push( elm )
        } else if( elm instanceof Projectile ){
            this.projectiles.push( elm )
        } else {
            this.items.push( elm )
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
           // console.log( e.button )
           const targ = this.eventTarget

            if( targ instanceof Player){
                
                targ.clickEvent( e, (proj:Projectile | Entity) => {

                    this.createElement( proj )

                }, this.camera )

           } else {
            this.uiManager?.clickEvent( e )
           }

            //this.eventTarget?.clickEvent?.( e )
        })


        events.wheel( e => {
            const delta = e.deltaY / 1000
           //this.camera.zoom = Math.max(.1, this.camera.zoom - delta)
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

        const h = 180
        const player = new Player({
            x: 0, y: -100, w:h / 2, h,
            life: 500, type: 'player',
            speed: 10,
            zindex: 10
        })

        const enemy = new Enemy({
            x: 350, y: 400, w: 100, h: 100,
            life: 100, type: 'any',
            speed: 5
        })

        const life = new Life({
            x: 200,
            y: 200,
            w: 50, h:50,
            description:"d",
            name: "0"
        })

        this.items.push( life )


        this.entities.push( player )
        this.entities.push( enemy )
        this.entities.push( this.Boss )

        this.Boss.setPlayer( player )

        // this.entities.push( entity )
        // this.createElement( entity )

        this.cameraTarget = player
        this.eventTarget = player
    }

    collision( caller:Rect | Record<string, number>, b:Rect ){

        if( caller === b || caller.self == b ) return false

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

    isInCameraRange( rect : Rect, {width, height}:HTMLCanvasElement, bonus:number=100){

        const cam = this.camera
        const z = cam.zoom

        const camObj  =  {
            x: (cam.x - bonus) * z,
            y: (cam.y - bonus) * z,
            w: width  + bonus * 2 * z,
            h: height + bonus * 2 * z
        }

        const item =  rect.getCollisionMask()
        /*
        {
            x:rect.x * z,
            y:rect.y * z,
            w:rect.w * z,
            h:rect.h * z
        }
        */
            

        const inCamera = Game.IsInside( item, camObj )

        return inCamera

    }

    removeElement( elm:Entity | Projectile, self:Game ){

        if( elm instanceof Entity){

            self.entities = self.entities.filter( entity =>  entity !== elm )

        } else {

            self.projectiles = self.projectiles.filter( proj =>  proj !== elm )

        }
       
    }

    insideMap( item: Entity ){
        if( !this.ctx ){
            return [ item.x, item.y ]
        }
        const {width, height} = this.ctx.canvas

        const min = 0
        const [ maxW, maxH ] = this.getMapSize()

        const clamp = (current:number, max:number) => Math.min( Math.max( current, min), max )

        return [
            clamp( item.x, maxW - 100),
            clamp( item.y, maxH )
        ]
    }
    
    update( ctx: CanvasRenderingContext2D, self: Game ){
        // Tick
        const cam = self.camera
        const canvas = ctx.canvas

        if( self.eventTarget ){
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

        function draw(color:string, y:number){
            ctx.fillStyle = color
            ctx.fillRect(0, y, innerWidth, innerHeight - y)
        }

        const colors = [ '#070418', '#08051c', '#090620', '#0a0724',
             '#0c0829', '#0c082b', '#0c082b', '#0c082b', '#13082b', '#18082b', '#1d082b',  ]


        colors.forEach( (elm:string, i:number) => {
            const sizeHeight = innerHeight / colors.length - 1
            draw( elm, i * sizeHeight)
        })


        // self.Boss.tick()
        // self.Boss.render(  ctx, cam, self.spriteSize, self.spriteSheet )


        const renderable = [
            ...self.projectiles,
            ...self.entities,
            ...self.map.getTiles(),
            ...self.items
        ]
            .filter( item => self.isInCameraRange( item, canvas, 700 ))


        const renderableOrder = renderable.sort(
            ( a: Rect, b:Rect ) => a.zindex - b.zindex )
 
        renderableOrder.forEach( item => {

            if( item instanceof Entity || item instanceof Projectile || item instanceof Item ){
            
                if( item.getLife() <= 0 ) {

                    item.die( 
                        (elm:Entity|Projectile) => {self.removeElement( elm, self )},
                        ( elm:Item ) => {self.createElement( elm )},
                        () => self.getScore(self),
                        (s:number) => self.setScore(self, s)
                    )

                    return
                }

                const collider = ( e:Rect ) => renderable.filter(elm => 

                    elm.type != "Projectile" && self.collision( e, elm )

                )

                
                if( item instanceof Entity ){
                    const [ x , y ] = self.insideMap( item )
                
                    item.x = x
                    item.y = y
                }

                item.tick( collider )
                
            }

          

            const renderDistance = 100

            if( self.isInCameraRange(item, canvas, renderDistance) ){

                item.render( ctx, cam, self.spriteSize, self.spriteSheet )
 
            }

        })

        // self.uiManager?.currentInterface?.render( ctx )


        return
        // self.uiManager.transitionRunning?.( ctx,'blue' )

    }

    getScore( self:Game){ return self.score }
    setScore( self:Game, s:number) { self.score = s }

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
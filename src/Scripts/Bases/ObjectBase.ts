export interface BaseObjectProps {
    x: number
    y: number
    w: number
    h: number
    classType?:string
    zindex?: number
    collisionMask?: Record<string, number>
    type?: string

}

export class BaseObject {
    public x
    public y
    public w
    public h
    public classType:string
    public zindex: number
    public collisionMask:Record<string, number>
    public self: BaseObject = this
    public type: string
    constructor({x=0, y=0, w=0, h=0, classType="Rect", zindex = 2, type="Rect", collisionMask={x, y, w, h}}:BaseObjectProps){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.classType = classType
        this.zindex = zindex 
        this.collisionMask = collisionMask
        this.type = type
    }

    getCollisionMask(){
        return this.collisionMask
    }

    updateCollisionMask(){
        const { x, y, w, h } = this
        this.collisionMask = { x, y, w, h }
    }

    /*
    fill( ctx:CanvasRenderingContext2D, color:string ){
        ctx.fillStyle = color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    */
}

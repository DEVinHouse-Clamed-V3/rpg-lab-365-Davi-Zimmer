export class Camera {
    public x:number
    public y:number

    constructor(x:number, y:number){
        this.x = x
        this.y = y
    }

    clamp(current:number, min:number, max:number){
        return Math.min( Math.max( current, min ), max)
    }
}
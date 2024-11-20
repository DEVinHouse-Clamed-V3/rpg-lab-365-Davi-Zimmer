import { Rect } from "../Bases/Rect.js"

export interface InterfaceProps extends Rect{
    name: string
}

export class Interface extends Rect {
    public name: string


    constructor( props:InterfaceProps ){

        super( props )

        this.name = props.name
        
    }

    changeTo(  ){

    }    

}

import { Item, ItemProps } from "./Item.js";

export interface WeaponProps extends ItemProps {
    damage: number
}

export class Weapon extends Item {
    private damage: number = 0

    constructor({x, y, w, h, damage, name, description} : WeaponProps){
        super({ x, y, w, h, name, description })
        
        this.setDamage( damage )
        
    }

    getDamage() { return this.damage }
    setDamage( damage:number ) { this.damage = damage }

}

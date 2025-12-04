//import type Group from "./Group"


export  class Concept{
    readonly id:number
    readonly name: string
    readonly description:string
    //readonly groups: Group[]

    constructor(
        attrs:{
            id:number,
            name:string,
            description:string
            //groups:Group[]
        }
    ){
        this.id = attrs.id
        this.name = attrs.name
        this.description = attrs.description
        //this.groups = attrs.groups
    }
}

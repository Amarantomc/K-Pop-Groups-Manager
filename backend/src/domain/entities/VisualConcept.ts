//import type Group from "./Group"

export default class VisualConcept{
    readonly id:number
    readonly picture: any
    //readonly group: Group

    constructor(
        attrs:{
            id:number,
            picture: any
            //group:Group
        }
    ){
        this.id = attrs.id
        this.picture = attrs.picture
        //this.group = attrs.group
    }
}

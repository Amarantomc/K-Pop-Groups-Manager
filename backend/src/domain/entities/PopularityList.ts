import type Song from "./Song"

export default class PopularityList{
    readonly id:number
    readonly name:string
    readonly listType:string
    readonly songs:Array<Song>

    constructor(attrs:{id:number,name:string,listType:string,songs:Array<Song>}){
        this.id = attrs.id
        this.name = attrs.name
        this.listType = attrs.listType
        this.songs = attrs.songs
    }
}
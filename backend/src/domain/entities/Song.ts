export default class Song{
    readonly id: number
    readonly title: string
    readonly releaseDate: Date|string
    readonly producer: string 
    readonly gender: string

    constructor (attrs:{id:number,title:string,releaseDate:Date|string,producer:string,gender:string}){
        this.id = attrs.id
        this.title = attrs.title
        this.releaseDate = attrs.releaseDate
        this.producer = attrs.producer
        this.gender = attrs.gender
    }
}
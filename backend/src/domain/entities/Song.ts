import type { Album } from "./Album";
import type PopularityList from "./PopularityList";

export default class Song {
	readonly id: number;
	readonly title: string;
	readonly releaseDate: Date;
	readonly producer: string;
	readonly gender: string;
	readonly popularityLists: Array<PopularityList>;
	readonly albums: Array<Album>;

	constructor(attrs: {
		id: number;
		title: string;
		releaseDate: Date;
		producer: string;
		gender: string;
		popularityLists: Array<PopularityList>;
		albums: Array<Album>;
	}) {
		this.id = attrs.id;
		this.title = attrs.title;
		this.releaseDate = attrs.releaseDate;
		this.producer = attrs.producer;
		this.gender = attrs.gender;
		this.popularityLists = attrs.popularityLists;
		this.albums = attrs.albums;
	}
}

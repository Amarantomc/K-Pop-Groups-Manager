import type { Album } from "./Album";
import type PopularityList from "./PopularityList";

export class Song {
	readonly id: number;
	readonly title: string;
	readonly releaseDate: Date;
	readonly producer: string;
	readonly genre: string;
	readonly albums: Array<Album>;
	readonly popularityLists: Array<PopularityList>;

	constructor(attrs: {
		id: number;
		title: string;
		releaseDate: Date;
		producer: string;
		genre: string;
		albums: Array<Album>;
		popularityLists: Array<PopularityList>;
	}) {
		this.id = attrs.id;
		this.title = attrs.title;
		this.releaseDate = attrs.releaseDate;
		this.producer = attrs.producer;
		this.genre = attrs.genre;
		this.albums = attrs.albums;
		this.popularityLists = attrs.popularityLists;
	}
}

import type { Artist } from "./Artist";
import type { Group } from "./Group";
import type { Song } from "./Song";
import type Award from "./Award";

export class Album {
	readonly id: number;
	readonly title: string;
	readonly releaseDate: Date;
	readonly producer: string;
	readonly noSongs: number;
	readonly noCopiesSold: number;
	readonly songs: Array<Song>;
	readonly artists: Array<Artist>;
	readonly groups: Array<Group>;
	readonly awards: Array<Award>;

	constructor(attrs: {
		id: number;
		title: string;
		releaseDate: Date;
		producer: string;
		noSongs: number;
		noCopiesSold: number;
		songs: Array<Song>;
		artists?: Array<Artist>;
		groups?: Array<Group>;
		awards?: Array<Award>;
	}) {
		this.id = attrs.id;
		this.title = attrs.title;
		this.releaseDate = attrs.releaseDate;
		this.producer = attrs.producer;
		this.noSongs = attrs.noSongs;
		this.noCopiesSold = attrs.noCopiesSold;
		this.songs = attrs.songs;
		this.artists = attrs.artists ?? [];
		this.groups = attrs.groups ?? [];
		this.awards = attrs.awards ?? [];
	}
}

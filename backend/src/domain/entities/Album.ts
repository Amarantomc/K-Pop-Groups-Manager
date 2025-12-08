import type { Artist } from "./Artist";
import type { Group } from "./Group";
import type Award from "./Award";
import type Song from "./Song";

export default class Album {
	readonly id: number;
	readonly title: string;
	readonly releaseDate: Date | string;
	readonly producer: string;
	readonly noSongs: number;
	readonly noCopiesSold: number;
	readonly songs: Array<Song>;
	readonly groups: Array<Group>;
	readonly artists: Array<Artist>;
	readonly awards: Array<Award>;

	constructor(attrs: {
		id: number;
		title: string;
		releaseDate: Date | string;
		producer: string;
		noSongs: number;
		noCopiesSold: number;
		songs: Array<Song>;
		groups: Array<Group>;
		artists?: Array<Artist>;
		awards?: Array<Award>;
	}) {
		this.id = attrs.id;
		this.title = attrs.title;
		this.releaseDate = attrs.releaseDate;
		this.producer = attrs.producer;
		this.noSongs = attrs.noSongs;
		this.noCopiesSold = attrs.noCopiesSold;
		this.songs = attrs.songs;

		// Interrelaciones q admiten null o ningun elemento
		this.groups = attrs.groups ?? [];
		this.artists = attrs.artists ?? [];
		this.awards = attrs.awards ?? [];
	}
}

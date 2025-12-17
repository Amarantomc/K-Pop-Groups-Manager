export class CreateSongDto {
  constructor(
    public readonly title: string,
    public readonly gender: string,
    public readonly producer: string,
    public releaseDate: string|Date,
    public readonly albumIds: number[]
  ) {}

  static Create(body: any): CreateSongDto {
    
    if(!body.title || !body.gender || !body.producer){
            throw new Error("Missing required fields");
        }
     
 return new CreateSongDto(
      body.title,
      body.gender,
      body.producer,
      body.releaseDate,
      body.albumIds?.map((id: any) => Number(id))
    );
  }
}
export class Item {
  public id: string = ''
  public title: string ='' //  17-03 interesting seminar
  public activity: string ='' //  Some informations
  public description: string ='' //  Some informations
  public attachments!: any[]
  public media!: any[]
  public images!: any[]
  public format: string ='' //bbcode, html
  status: string ='' //draft, published
}

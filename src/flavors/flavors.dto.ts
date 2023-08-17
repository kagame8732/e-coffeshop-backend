export interface IFlavor extends Document {
  readonly name: string;
  readonly ingredients: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class CreateFlavorDto implements Partial<IFlavor> {
  name?: string;
  ingredients?: string[];
}

export class ResponseFlavorDto implements Partial<IFlavor> {
  id?: string;
  name: string;
  ingredients?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

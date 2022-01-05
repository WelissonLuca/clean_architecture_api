import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,
  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  async getCollection(name: string): Promise<Collection> {
    return this.client.db().collection(name);
  },

  map: (collection: any): any => {
    console.log(collection);
    const { _id, ...collectionWithoutId } = collection;

    return { ...collectionWithoutId, id: _id };
  },
};
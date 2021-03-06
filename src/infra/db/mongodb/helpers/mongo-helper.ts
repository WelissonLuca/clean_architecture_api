import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,
  async connect(uri: string): Promise<void> {
    this.url = uri as string;
    this.client = await MongoClient.connect(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!(await this.client?.isConnected())) {
      await this.connect(this.url);
    }
    return this.client.db().collection(name);
  },

  map: (data: any): any => {
    const { _id, ...collectionWithoutId } = data;

    return { ...collectionWithoutId, id: _id };
  },

  mapCollection: (collection: any[]): any[] => {
    return collection.map((c) => MongoHelper.map(c));
  },
};

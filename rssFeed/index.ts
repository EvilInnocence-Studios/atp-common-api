export declare interface RssFeedItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    guid: string;
}

export declare type FeedGenerator = () => Promise<RssFeedItem[]>;

const feeds: { [key: string]: FeedGenerator } = {};

export const registerFeed = (name: string, generator: FeedGenerator) =>{
    feeds[name] = generator;
}

export const getFeedGenerator = (name: string): FeedGenerator | undefined => {
    return feeds[name];
}

export const getAllFeedNames = (): string[] => {
    return Object.keys(feeds);
}

export const unregisterFeed = (name: string) => {
    delete feeds[name];
}

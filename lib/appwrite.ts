import {
  Client,
  Account,
  ID,
  Databases,
  OAuthProvider,
  Avatars,
  Query,
  Storage,
} from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { cards, featuredCards } from "@/constants/data";
import { propertiesImages, agentImages, reviewImages } from "@/lib/data";

export const config = {
  platform: "homenza",
  endpoint: "dummy",
  projectId: "dummy",
  databaseId: "dummy",
  galleriesCollectionId: "your_galleries_collection_id",
  reviewsCollectionId: "your_reviews_collection_id",
  agentsCollectionId: "your_agents_collection_id",
  propertiesCollectionId: "your_properties_collection_id",
  bucketId: "dummy",
};

export const client = new Client();
client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );
    if (!response) throw new Error("Create OAuth2 token failed");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );
    if (browserResult.type !== "success")
      throw new Error("Create OAuth2 token failed");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("Create OAuth2 token failed");

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("Failed to create session");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const result = await account.get();
    if (result.$id) {
      const userAvatar = avatar.getInitials(result.name);

      return {
        ...result,
        avatar: userAvatar.toString(),
      };
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getLatestProperties() {
  try {
    if (!config.propertiesCollectionId || config.propertiesCollectionId === 'your_properties_collection_id') {
      return featuredCards.map((item, index) => ({
        $id: `featured_${index}`,
        name: item.title,
        address: item.location,
        price: parseInt(item.price.replace('$', '')),
        image: propertiesImages[index % propertiesImages.length],
        rating: item.rating,
        type: item.category,
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        area: Math.floor(Math.random() * 2000) + 500,
      }));
    }
    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      [Query.orderAsc("$createdAt"), Query.limit(5)]
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    if (!config.propertiesCollectionId || config.propertiesCollectionId === 'your_properties_collection_id') {
      let dummyData = cards.map((item, index) => ({
        $id: `property_${index}`,
        name: item.title,
        address: item.location,
        price: parseInt(item.price.replace('$', '')),
        image: propertiesImages[index % propertiesImages.length],
        rating: item.rating,
        type: item.category,
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        area: Math.floor(Math.random() * 2000) + 500,
      }));

      if (filter && filter !== "All") {
        dummyData = dummyData.filter(item => item.type.toLowerCase().includes(filter.toLowerCase()));
      }

      if (query) {
        dummyData = dummyData.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.address.toLowerCase().includes(query.toLowerCase()) ||
          item.type.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (limit) {
        dummyData = dummyData.slice(0, limit);
      }

      return dummyData;
    }
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All")
      buildQuery.push(Query.equal("type", filter));

    if (query)
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ])
      );

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      buildQuery
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// write function to get property by id
export async function getPropertyById({ id }: { id: string }) {
  try {
    if (!config.propertiesCollectionId || config.propertiesCollectionId === 'your_properties_collection_id') {
      const allCards = [...cards, ...featuredCards];
      const cardIndex = parseInt(id.split('_')[1]) || 0;
      const card = allCards[cardIndex];
      
      if (!card) return null;
      
      return {
        $id: id,
        name: card.title,
        address: card.location,
        price: parseInt(card.price.replace('$', '')),
        image: propertiesImages[cardIndex % propertiesImages.length],
        rating: card.rating,
        type: card.category,
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        area: Math.floor(Math.random() * 2000) + 500,
        description: `Beautiful ${card.category} located in ${card.location}. Perfect for families looking for a comfortable home.`,
        facilities: ["Wifi", "Car Parking", "Swimming pool", "Gym"],
        agent: {
          $id: "agent_1",
          name: "John Doe",
          email: "john@homenza.com",
          avatar: agentImages[0]
        },
        reviews: [{
          $id: "review_1",
          name: "Sarah Wilson",
          avatar: reviewImages[0],
          review: "Great property with excellent amenities!",
          rating: 5
        }],
        gallery: [{
          $id: "gallery_1",
          image: propertiesImages[0]
        }]
      };
    }
    const result = await databases.getDocument(
      config.databaseId!,
      config.propertiesCollectionId!,
      id
    );
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

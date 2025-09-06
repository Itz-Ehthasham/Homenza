import { View, Text, Image } from "react-native";

import images from "@/constants/images";
import icons from "@/constants/icons";
import { Models } from "react-native-appwrite";

interface Props {
  item: Models.Document;
}

const Comment = ({ item }: Props) => {
  return (
    <View className="flex flex-col items-start">
      <View className="flex flex-row items-center">
        <Image 
          source={{ uri: item.avatar || 'https://via.placeholder.com/56x56' }} 
          className="size-14 rounded-full" 
          defaultSource={{ uri: 'https://via.placeholder.com/56x56' }}
        />
        <Text className="text-base text-black-300 text-start font-rubik-bold ml-3">
          {item.name || 'Anonymous'}
        </Text>
      </View>

      <Text className="text-black-200 text-base font-rubik mt-2">
        {item.review || 'No review available'}
      </Text>

      <View className="flex flex-row items-center w-full justify-between mt-4">
        <View className="flex flex-row items-center">
          <Image
            source={icons.heart}
            className="size-5"
            tintColor={"#0061FF"}
          />
          <Text className="text-black-300 text-sm font-rubik-medium ml-2">
            120
          </Text>
        </View>
        <Text className="text-black-100 text-sm font-rubik">
          {item.$createdAt ? new Date(item.$createdAt).toDateString() : 'Recent'}
        </Text>
      </View>
    </View>
  );
};

export default Comment;

import {Image, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {Link} from "expo-router";
import MaskedView from "@react-native-masked-view/masked-view";
import {images} from "@/constants/images";

const TrendingMovieCard = ({movie: {movie_id, title, poster_url}, index}: TrendingCardProps) => {
    return (
        <Link href={`/movies/${movie_id}`} asChild>
            <TouchableOpacity className="w-32 relative pl-5">
                <Image source={{uri: poster_url}}
                       resizeMode="cover"
                       className="w-32 h-48 rounded-lg"/>
                <View className="absolute bottom-9 px-2 py-1 rounded-full">
                    <MaskedView maskElement={
                        <Text className="font-bold text-white text-6xl">{index + 1}</Text>
                    }>
                        <Image source={images.rankingGradient} className="size-14" resizeMode="cover"/>
                    </MaskedView>
                </View>
                <Text className="text-light-200 text-sm font-bold mt-2" numberOfLines={2}>{title}</Text>
            </TouchableOpacity>
        </Link>
    )
}
export default TrendingMovieCard

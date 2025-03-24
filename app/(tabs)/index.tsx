import {ActivityIndicator, FlatList, Image, ScrollView, Text, useWindowDimensions, View} from "react-native";
import {images} from "@/constants/images";
import SearchBar from "@/components/SearchBar";
import {useRouter} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchMovies} from "@/services/api";
import MovieCard from "@/components/MovieCard";
import {getTrendingMovies} from "@/services/appwrite";
import TrendingMovieCard from "@/components/TrendingMovieCard";

export default function Index() {
    const {width, height} = useWindowDimensions();
    const router = useRouter();

    const {
        data: trendingMovies,
        loading: trendingLoading,
        error: trendingError,
    } = useFetch(getTrendingMovies);

    const {
        data: movies,
        loading: moviesLoading,
        error: moviesError
    } = useFetch(() => fetchMovies({
        query: ''
    }));

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bg}
                style={{position: "absolute", width, height}}
                resizeMode="stretch"
            />
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{minHeight: "100%", paddingBottom: 10}}
            >
                <View className="h-20"/>

                {moviesLoading || trendingLoading ? (
                    <ActivityIndicator
                        size="large"
                        color="#0000ff"
                        className="mt-10 self-center"
                    />
                ) : (
                    moviesError || trendingError ? (
                        <Text>Error: {moviesError?.message || trendingError?.message}</Text>
                    ) : (
                        <View className="flex-1 mt-5">
                            <SearchBar
                                onPress={() => {
                                    router.push("/search");
                                }}
                                placeholder="Search for a movie"
                            />

                            {trendingMovies && (
                                <View className="mt-10">
                                    <Text className="text-lg text-white font-bold mb-3 px-5">Trending Movies</Text>

                                    <FlatList
                                        className="mb-4 mt-3"
                                        contentContainerStyle={{paddingRight: 40}}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        ItemSeparatorComponent={() => (<View className={"w-4"}/>)}
                                        data={trendingMovies}
                                        renderItem={({item, index}) => (
                                            <TrendingMovieCard movie={item} index={index}/>
                                        )}
                                        keyExtractor={(item) => item.movie_id.toString()}
                                    />
                                </View>
                            )}

                            <>
                                <Text className="text-lg text-white font-bold mt-5 mb-3 px-5">
                                    Latest Movies
                                </Text>

                                <FlatList
                                    data={movies}
                                    renderItem={({item}) => (
                                        <MovieCard
                                            {...item}
                                        />
                                    )}
                                    keyExtractor={(item) => item.id}
                                    numColumns={3}
                                    columnWrapperStyle={{
                                        gap: 20,
                                        paddingRight: 5,
                                        marginBottom: 10
                                    }}
                                    className="mt-2 pb-32 px-5"
                                    scrollEnabled={false}
                                />
                            </>
                        </View>
                    )
                )}
            </ScrollView>
        </View>
    );
}

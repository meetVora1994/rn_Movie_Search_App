import {ActivityIndicator, FlatList, Image, Text, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import {images} from "@/constants/images";
import MovieCard from "@/components/MovieCard";
import useFetch from "@/services/useFetch";
import {fetchMovies} from "@/services/api";
import SearchBar from "@/components/SearchBar";
import {updateSearchCount} from "@/services/appwrite";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const {
        data: movies,
        loading,
        error,
        refetch,
        reset
    } = useFetch(() => fetchMovies({
        query: searchQuery
    }), false);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim()) {
                await refetch();
            } else {
                reset()
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchQuery])
    useEffect(() => {
        if (movies?.length > 1) {
            updateSearchCount(searchQuery, movies?.[0])
        }
    }, [movies])

    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode="cover"/>

            <FlatList
                data={movies}
                renderItem={({item}) => <MovieCard {...item}/>}
                keyExtractor={(item) => item.id}
                numColumns={3}
                columnWrapperStyle={{
                    gap: 16,
                    marginVertical: 16,
                    paddingHorizontal: 20
                }}
                contentContainerStyle={{paddingBottom: 100}}
                ListHeaderComponent={
                    <>
                        <View className="h-20"/>

                        <View className="my-5">
                            <SearchBar
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChangeText={(text: string) => setSearchQuery(text)}
                            />
                        </View>

                        {loading && (
                            <ActivityIndicator size="large" color="#0000FF" className="my-3"/>
                        )}

                        {error && (
                            <Text className="text-red-500 px-5 my-3">Error: {error.message}</Text>
                        )}

                        {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
                            <Text className="text-xl text-white font-bold px-5">
                                Search Results for {' '}
                                <Text className="text-accent">{searchQuery}</Text>
                            </Text>
                        )}
                    </>
                }
                ListEmptyComponent={
                    !loading && !error ? (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-gray-500">
                                {searchQuery.trim() ? 'No movies found' : 'Search for a movie'}
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    )
}
export default Search

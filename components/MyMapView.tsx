import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface MyMapViewProps {
    location: Location.LocationObject | null;
    setLocation: (location: Location.LocationObject) => void;
}

export default function MyMapView({ location, setLocation }: MyMapViewProps) {
    const [initialRegion, setInitialRegion] = useState({
        latitude: 13.7563, // Default fallback
        longitude: 100.5018,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    // Get current location if we don't have one
    useEffect(() => {
        if (!location) {
            getCurrentLocation();
        } else {
            setInitialRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        }
    }, []);

    const getCurrentLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            let pos = await Location.getCurrentPositionAsync({});

            setInitialRegion({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });

            // Update parent state
            setLocation(pos);
        } catch (e) {
            console.log(e);
        }
    };

    const handleMapPress = (e: any) => {
        const coords = e.nativeEvent.coordinate;

        // We create a mock Location object to match the type signature
        const newLocation: Location.LocationObject = {
            coords: {
                latitude: coords.latitude,
                longitude: coords.longitude,
                altitude: null,
                accuracy: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null,
            },
            timestamp: Date.now(),
        };

        setLocation(newLocation);
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={true}
                onPress={handleMapPress}
            >
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="จุดติดตั้ง"
                        description="พิกัดที่เลือกไว้"
                        pinColor="#3B82F6"
                    />
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    map: {
        width: "100%",
        height: "100%",
    },
});

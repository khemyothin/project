import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { supabase } from '../lib/supabase';

export default function MapScreen() {
    const router = useRouter();
    const [installations, setInstallations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [initialRegion, setInitialRegion] = useState({
        latitude: 13.7563, // Default to Bangkok
        longitude: 100.5018,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        loadData();
        getUserLocation();
    }, []);

    const loadData = async () => {
        try {
            const { data, error } = await supabase
                .from('installations')
                .select('*');

            if (error) throw error;

            if (data) {
                setInstallations(data.filter((item: any) => item.location)); // Only get those with locations
            }
        } catch (error) {
            console.error('Error loading map data from Supabase:', error);
        } finally {
            setLoading(false);
        }
    };

    const getUserLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            let location = await Location.getCurrentPositionAsync({});
            setInitialRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        } catch (error) {
            console.log('Error getting location for map', error);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#0F172A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>แผนที่จุดติดตั้ง</Text>
                    <View style={{ width: 40 }} />
                </View>

                {loading ? (
                    <View style={styles.mapPlaceholder}>
                        <ActivityIndicator size="large" color="#3B82F6" />
                        <Text style={styles.placeholderText}>กำลังดึงข้อมูลแผนที่...</Text>
                    </View>
                ) : (
                    <MapView
                        style={styles.map}
                        initialRegion={initialRegion}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                    >
                        {installations.map((item) => {
                            // Ensure coordinates are valid numbers before rendering
                            if (!item.location || typeof item.location.latitude !== 'number' || typeof item.location.longitude !== 'number') {
                                return null;
                            }
                            return (
                                <Marker
                                    key={item.id}
                                    coordinate={{
                                        latitude: item.location.latitude,
                                        longitude: item.location.longitude,
                                    }}
                                    title={item.title}
                                    description={item.description}
                                />
                            );
                        })}
                    </MapView>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        zIndex: 10,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    mapPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E2E8F0',
    },
    placeholderText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#64748B',
    },
});

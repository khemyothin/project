import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function InstallationDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [installation, setInstallation] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('installations')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setInstallation(data);
            } catch (error) {
                console.error('Error fetching details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
            </SafeAreaView>
        );
    }

    if (!installation) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>ไม่พบข้อมูล</Text>
                    <View style={{ width: 40 }} />
                </View>
                <Text style={styles.errorText}>ไม่สามารถโหลดข้อมูลจุดติดตั้งนี้ได้</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>รายละเอียดจุดติดตั้ง</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.card}>
                        <View style={styles.titleSection}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="cctv" size={32} color="#3B82F6" />
                            </View>
                            <Text style={styles.title}>{installation.title}</Text>
                        </View>

                        <View style={styles.divider} />

                        {installation.image_base64 && (
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: installation.image_base64 }}
                                    style={styles.attachedImage}
                                />
                            </View>
                        )}

                        <View style={styles.infoRow}>
                            <Ionicons name="information-circle-outline" size={20} color="#64748B" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>สถานะ</Text>
                                <View style={[styles.statusBadge, { backgroundColor: installation.status === 'เสร็จสิ้น' ? '#D1FAE5' : '#FEF3C7' }]}>
                                    <Text style={[styles.statusText, { color: installation.status === 'เสร็จสิ้น' ? '#059669' : '#D97706' }]}>
                                        {installation.status || 'เสร็จสิ้น'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <Ionicons name="calendar-outline" size={20} color="#64748B" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>วันที่ติดตั้ง</Text>
                                <Text style={styles.infoValue}>
                                    {new Date(installation.created_at || installation.date).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </Text>
                            </View>
                        </View>

                        {installation.location && typeof installation.location === 'object' && installation.location.latitude && (
                            <View style={styles.infoRow}>
                                <Ionicons name="map-outline" size={20} color="#64748B" />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>พิกัด (ละติจูด, ลองจิจูด)</Text>
                                    <Text style={styles.infoValue}>{installation.location.latitude}, {installation.location.longitude}</Text>
                                </View>
                            </View>
                        )}
                        {installation.location && typeof installation.location === 'string' && (
                            <View style={styles.infoRow}>
                                <Ionicons name="location-outline" size={20} color="#64748B" />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>พิกัด / สถานที่</Text>
                                    <Text style={styles.infoValue}>{installation.location}</Text>
                                </View>
                            </View>
                        )}

                        {installation.description && (
                            <View style={styles.infoRow}>
                                <Ionicons name="document-text-outline" size={20} color="#64748B" />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>รายละเอียดเพิ่มเติม</Text>
                                    <Text style={styles.infoValue}>{installation.description}</Text>
                                </View>
                            </View>
                        )}

                    </View>
                </ScrollView>
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
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    scrollContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E293B',
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginBottom: 20,
    },
    imageContainer: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
        backgroundColor: '#F1F5F9',
    },
    attachedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    infoContent: {
        marginLeft: 16,
        flex: 1,
    },
    infoLabel: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: '#1E293B',
        fontWeight: '500',
        lineHeight: 24,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginTop: 2,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    errorText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: '#64748B',
    }
});

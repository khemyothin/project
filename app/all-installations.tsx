import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function AllInstallations() {
    const router = useRouter();
    const [installations, setInstallations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllInstallations = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('installations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInstallations(data || []);
        } catch (error) {
            console.error('Error fetching data from Supabase:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllInstallations();
    }, []);

    const handleLongPress = (item: any) => {
        Alert.alert(
            "จัดการข้อมูล",
            `คุณต้องการทำอะไรกับ "${item.title}"?`,
            [
                {
                    text: "ยกเลิก",
                    style: "cancel"
                },
                {
                    text: "แก้ไข",
                    onPress: () => router.push(`/edit/${item.id}` as any)
                },
                {
                    text: "ลบ",
                    style: "destructive",
                    onPress: () => confirmDelete(item)
                }
            ]
        );
    };

    const confirmDelete = (item: any) => {
        Alert.alert(
            "ยืนยันการลบ",
            `คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูล "${item.title}"?\nการกระทำนี้ไม่สามารถแก้คืนได้`,
            [
                {
                    text: "ยกเลิก",
                    style: "cancel"
                },
                {
                    text: "ลบข้อมูล",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const { error } = await supabase
                                .from('installations')
                                .delete()
                                .eq('id', item.id);

                            if (error) throw error;

                            // ลบสำเร็จ ให้ดึงข้อมูลมาแสดงใหม่แทนการกรองออกเฉยๆ เพื่อความชัวร์ หรือจะ filter state ก็ได้
                            setInstallations(prev => prev.filter(inst => inst.id !== item.id));
                            Alert.alert("สำเร็จ", "ลบข้อมูลเรียบร้อยแล้ว");
                        } catch (error) {
                            console.error('Error deleting data:', error);
                            Alert.alert("ข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>จุดติดตั้งทั้งหมด</Text>
                    <TouchableOpacity onPress={fetchAllInstallations} style={styles.refreshButton}>
                        <Ionicons name="refresh" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />
                ) : installations.length === 0 ? (
                    <Text style={styles.emptyText}>ยังไม่มีข้อมูลการติดตั้ง</Text>
                ) : (
                    <FlatList
                        data={installations}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.recentItem}
                                onPress={() => router.push(`/details/${item.id}` as any)}
                                onLongPress={() => handleLongPress(item)}
                            >
                                <View style={styles.recentItemIcon}>
                                    <MaterialCommunityIcons name="cctv" size={24} color="#64748B" />
                                </View>
                                <View style={styles.recentItemInfo}>
                                    <Text style={styles.recentItemTitle} numberOfLines={1}>{item.title}</Text>
                                    <Text style={styles.recentItemDate}>
                                        {new Date(item.created_at || item.date).toLocaleDateString('th-TH')}
                                    </Text>
                                    <Text style={styles.helpText}>กดค้างเพื่อแก้ไข/ลบ</Text>
                                </View>
                                <View style={styles.recentItemStatus}>
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={16}
                                        color="#10B981"
                                    />
                                    <Text style={[
                                        styles.recentItemStatusText,
                                        { color: '#10B981' }
                                    ]}>
                                        {item.status || 'เสร็จสิ้น'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
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
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    refreshButton: {
        padding: 8,
        marginRight: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    listContent: {
        padding: 20,
        gap: 12,
        paddingBottom: 40,
    },
    emptyText: {
        textAlign: 'center',
        color: '#94A3B8',
        marginTop: 40,
        fontSize: 15,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    recentItemIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    recentItemInfo: {
        flex: 1,
        marginRight: 8,
    },
    recentItemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 4,
    },
    recentItemDate: {
        fontSize: 13,
        color: '#94A3B8',
    },
    helpText: {
        fontSize: 11,
        color: '#CBD5E1',
        marginTop: 4,
        fontStyle: 'italic',
    },
    recentItemStatus: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 4,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
    },
    recentItemStatusText: {
        fontSize: 12,
        fontWeight: '600',
    }
});

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ReportsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#0F172A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>รายงาน</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.pageDescription}>สรุปผลการดำเนินงานจุดติดตั้งกล้องวงจรปิด</Text>

                    {/* Dummy Chart Area */}
                    <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>สถิติรายสัปดาห์</Text>
                        <View style={styles.chartPlaceholder}>
                            <Ionicons name="bar-chart" size={60} color="#CBD5E1" />
                        </View>
                    </View>

                    {/* Export Actions */}
                    <Text style={styles.sectionTitle}>ดาวน์โหลดรายงาน</Text>
                    <TouchableOpacity style={styles.exportCard}>
                        <View style={[styles.exportIconBox, { backgroundColor: '#FEE2E2' }]}>
                            <Ionicons name="document-text" size={24} color="#DC2626" />
                        </View>
                        <View style={styles.exportInfo}>
                            <Text style={styles.exportTitle}>รายงานประจำเดือน (PDF)</Text>
                            <Text style={styles.exportDate}>อัพเดทล่าสุดเมื่อ: 1 วันก่อน</Text>
                        </View>
                        <Ionicons name="download-outline" size={24} color="#64748B" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.exportCard}>
                        <View style={[styles.exportIconBox, { backgroundColor: '#DCFCE7' }]}>
                            <Ionicons name="grid" size={24} color="#16A34A" />
                        </View>
                        <View style={styles.exportInfo}>
                            <Text style={styles.exportTitle}>ข้อมูลทั้งหมด (Excel / CSV)</Text>
                            <Text style={styles.exportDate}>อัพเดทข้อมูลแบบ Real-time</Text>
                        </View>
                        <Ionicons name="download-outline" size={24} color="#64748B" />
                    </TouchableOpacity>

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
    pageDescription: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 20,
    },
    chartContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 16,
    },
    chartPlaceholder: {
        height: 180,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 12,
    },
    exportCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
    },
    exportIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    exportInfo: {
        flex: 1,
    },
    exportTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    exportDate: {
        fontSize: 12,
        color: '#94A3B8',
    }
});

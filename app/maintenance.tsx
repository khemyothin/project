import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MaintenanceScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#0F172A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>การซ่อมบำรุง</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity style={styles.reportIssueButton}>
                        <Ionicons name="warning" size={24} color="#FFF" />
                        <Text style={styles.reportIssueText}>แจ้งเหตุเสีย / แจ้งซ่อม</Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>รายการแจ้งซ่อมรอดำเนินการ</Text>

                    {[
                        { id: '1', title: 'กล้องไม่เชื่อมต่อ Wi-Fi', location: 'อาคาร A ทางเข้าหลัก', date: 'วันนี้ 09:12 น.' },
                        { id: '2', title: 'ภาพเบลอ/ไม่ชัดเจน', location: 'ลานจอดรถ P1', date: 'เมื่อวาน 16:30 น.' },
                    ].map((item) => (
                        <View key={item.id} style={styles.ticketCard}>
                            <View style={styles.ticketHeader}>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>รอดำเนินการ</Text>
                                </View>
                                <Text style={styles.ticketDate}>{item.date}</Text>
                            </View>
                            <Text style={styles.ticketTitle}>{item.title}</Text>
                            <View style={styles.ticketLocation}>
                                <Ionicons name="location-outline" size={16} color="#64748B" />
                                <Text style={styles.ticketLocationText}>{item.location}</Text>
                            </View>
                        </View>
                    ))}

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
    reportIssueButton: {
        flexDirection: 'row',
        backgroundColor: '#EF4444',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    reportIssueText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 16,
    },
    ticketCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusBadge: {
        backgroundColor: '#FEF2F2',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        color: '#DC2626',
        fontSize: 12,
        fontWeight: 'bold',
    },
    ticketDate: {
        fontSize: 12,
        color: '#94A3B8',
    },
    ticketTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 8,
    },
    ticketLocation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ticketLocationText: {
        fontSize: 14,
        color: '#64748B',
        marginLeft: 4,
    }
});

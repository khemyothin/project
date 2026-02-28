import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const [installations, setInstallations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0 });

  const fetchInstallations = async () => {
    try {
      setLoading(true);
      // Fetch recent 3
      const { data, error } = await supabase
        .from('installations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setInstallations(data || []);

      // Fetch statistics
      const { count: totalCount, error: countError } = await supabase
        .from('installations')
        .select('*', { count: 'exact', head: true });

      const { count: pendingCount, error: pendingError } = await supabase
        .from('installations')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'เสร็จสิ้น');

      if (!countError && !pendingError) {
        setStats({
          total: totalCount || 0,
          pending: pendingCount || 0
        });
      }

    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstallations();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>หน้าหลัก</Text>
            <Text style={styles.headerSubtitle}>ระบบจัดการจุดติดตั้ง</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={44} color="#1E293B" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
              <View style={styles.statIconRow}>
                <MaterialCommunityIcons name="cctv" size={28} color="#3B82F6" />
              </View>
              <Text style={styles.statCount}>{stats.total}</Text>
              <Text style={styles.statLabel}>ติดตั้งทั้งหมด</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FEF2F2' }]}>
              <View style={styles.statIconRow}>
                <MaterialCommunityIcons name="tools" size={26} color="#EF4444" />
              </View>
              <Text style={styles.statCount}>{stats.pending}</Text>
              <Text style={styles.statLabel}>รอดำเนินการ</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>เมนูหลัก</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/add')}>
              <View style={[styles.actionIconBg, { backgroundColor: '#3B82F6' }]}>
                <Ionicons name="location" size={28} color="#FFF" />
              </View>
              <Text style={styles.actionText}>เพิ่มจุดติดตั้ง</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/map')}>
              <View style={[styles.actionIconBg, { backgroundColor: '#10B981' }]}>
                <Ionicons name="map-outline" size={28} color="#FFF" />
              </View>
              <Text style={styles.actionText}>แผนที่จุดติดตั้ง</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/reports')}>
              <View style={[styles.actionIconBg, { backgroundColor: '#F59E0B' }]}>
                <Ionicons name="document-text-outline" size={28} color="#FFF" />
              </View>
              <Text style={styles.actionText}>รายงาน</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Installations */}
          <View style={styles.recentSectionHeader}>
            <Text style={styles.sectionTitle}>รายการล่าสุด (Supabase)</Text>
            <TouchableOpacity onPress={fetchInstallations}>
              <Ionicons name="refresh" size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 20 }} />
          ) : installations.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#94A3B8', marginTop: 20 }}>ยังไม่มีข้อมูลการติดตั้ง</Text>
          ) : (
            <FlatList
              data={installations}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false} // Since we are inside a ScrollView, we disable internal scrolling of FlatList
              contentContainerStyle={styles.recentList}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.recentItem}>
                  <View style={styles.recentItemIcon}>
                    <MaterialCommunityIcons name="cctv" size={24} color="#64748B" />
                  </View>
                  <View style={styles.recentItemInfo}>
                    <Text style={styles.recentItemTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.recentItemDate}>
                      {new Date(item.created_at || item.date).toLocaleDateString()}
                    </Text>
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

          {/* Spacer */}
          <View style={{ height: 20 }} />

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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 22,
    color: '#0F172A',
    fontWeight: 'bold',
    marginTop: 4,
  },
  profileButton: {
    padding: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'flex-start',
  },
  statIconRow: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  actionButton: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  actionIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  recentSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#3B82F6',
    fontWeight: '600',
    fontSize: 14,
  },
  recentList: {
    gap: 12,
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

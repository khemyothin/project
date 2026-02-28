import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { useTheme } from '../lib/ThemeContext';

import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
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

      if (!countError) {
        setStats(prev => ({ ...prev, total: totalCount || 0 }));
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

  // กำหนดสีตามโหมด
  const bgColor = isDarkMode ? '#0F172A' : '#F8FAFC';
  const cardColor = isDarkMode ? '#1E293B' : '#FFFFFF';
  const textColor = isDarkMode ? '#F8FAFC' : '#0F172A';
  const textSubColor = isDarkMode ? '#94A3B8' : '#64748B';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: cardColor, borderBottomColor: isDarkMode ? '#334155' : '#F1F5F9' }]}>
          <View>
            <Text style={[styles.headerTitle, { color: textSubColor }]}>หน้าหลัก</Text>
            <Text style={[styles.headerSubtitle, { color: textColor }]}>ระบบจัดการจุดติดตั้ง</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
              <Ionicons name={isDarkMode ? "sunny" : "moon"} size={28} color={isDarkMode ? "#FBBF24" : "#64748B"} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E3A8A' : '#EFF6FF', flex: 1 }]}>
              <View style={styles.statIconRow}>
                <MaterialCommunityIcons name="cctv" size={28} color={isDarkMode ? "#93C5FD" : "#3B82F6"} />
              </View>
              <Text style={[styles.statCount, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>{stats.total}</Text>
              <Text style={[styles.statLabel, { color: isDarkMode ? '#BFDBFE' : '#475569' }]}>ติดตั้งทั้งหมด</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={[styles.sectionTitle, { color: textColor }]}>เมนูหลัก</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: cardColor }]} onPress={() => router.push('/add')}>
              <View style={[styles.actionIconBg, { backgroundColor: '#3B82F6' }]}>
                <Ionicons name="location" size={28} color="#FFF" />
              </View>
              <Text style={[styles.actionText, { color: textColor }]}>เพิ่มจุดติดตั้ง</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, { backgroundColor: cardColor }]} onPress={() => router.push('/map')}>
              <View style={[styles.actionIconBg, { backgroundColor: '#10B981' }]}>
                <Ionicons name="map-outline" size={28} color="#FFF" />
              </View>
              <Text style={[styles.actionText, { color: textColor }]}>แผนที่จุดติดตั้ง</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, { backgroundColor: cardColor }]} onPress={() => router.push('/all-installations' as any)}>
              <View style={[styles.actionIconBg, { backgroundColor: '#8B5CF6' }]}>
                <MaterialCommunityIcons name="cctv" size={28} color="#FFF" />
              </View>
              <Text style={[styles.actionText, { color: textColor }]}>รายการกล้อง</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Installations */}
          <View style={styles.recentSectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>รายการล่าสุด (Supabase)</Text>
            <TouchableOpacity onPress={fetchInstallations}>
              <Ionicons name="refresh" size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 20 }} />
          ) : installations.length === 0 ? (
            <Text style={{ textAlign: 'center', color: textSubColor, marginTop: 20 }}>ยังไม่มีข้อมูลการติดตั้ง</Text>
          ) : (
            <FlatList
              data={installations}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.recentList}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.recentItem, { backgroundColor: cardColor }]} onPress={() => router.push(`/details/${item.id}` as any)}>
                  <View style={[styles.recentItemIcon, { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }]}>
                    <MaterialCommunityIcons name="cctv" size={24} color={isDarkMode ? "#E2E8F0" : "#64748B"} />
                  </View>
                  <View style={styles.recentItemInfo}>
                    <Text style={[styles.recentItemTitle, { color: textColor }]} numberOfLines={1}>{item.title}</Text>
                    <Text style={[styles.recentItemDate, { color: textSubColor }]}>
                      {new Date(item.created_at || item.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={[styles.recentItemStatus, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' }]}>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  iconButton: {
    padding: 4,
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statCount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    textAlign: 'center',
  },
  recentSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentList: {
    gap: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 4,
  },
  recentItemDate: {
    fontSize: 13,
  },
  recentItemStatus: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  recentItemStatusText: {
    fontSize: 12,
    fontWeight: '600',
  }
});

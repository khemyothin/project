import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MyMapView from '../components/MyMapView';
import { supabase } from '../lib/supabase';

export default function AddInstallation() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Location states
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // Attempt to get location when screen loads
        getLocation();
    }, []);

    const getLocation = async () => {
        setLocationLoading(true);
        setErrorMsg('');
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
        } catch (error) {
            setErrorMsg('Error fetching location');
            console.error(error);
        } finally {
            setLocationLoading(false);
        }
    };

    const saveInstallation = async () => {
        if (!title) {
            Alert.alert("ข้อผิดพลาด", "กรุณาระบุชื่อสถานที่ติดตั้ง");
            return;
        }

        try {
            setIsSubmitting(true);
            const { data, error } = await supabase
                .from('installations')
                .insert([
                    {
                        title,
                        description,
                        location: location ? { latitude: location.coords.latitude, longitude: location.coords.longitude } : null,
                        status: 'เสร็จสิ้น'
                    }
                ]);

            if (error) {
                console.error('Supabase Error:', error);
                Alert.alert("ไม่สามารถบันทึกได้", error.message);
                return;
            }

            Alert.alert("สำเร็จ", "บันทึกข้อมูลสำเร็จ", [
                { text: "ตกลง", onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.error('Error saving data:', error);
            Alert.alert("ข้อผิดพลาด", error?.message || "ระบบขัดข้อง กรุณาลองใหม่");
        } finally {
            setIsSubmitting(false);
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
                    <Text style={styles.headerTitle}>เพิ่มจุดติดตั้งใหม่</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>ชื่อสถานที่ / จุดติดตั้ง *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="ระบุชื่อสถานที่ (เช่น อาคาร A ชั้น 1)"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>รายละเอียดเพิ่มเติม</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="ระบุรายละเอียดทางเข้า, ปัญหา, สิ่งที่ต้องเตรียม ฯลฯ"
                            multiline
                            numberOfLines={4}
                            value={description}
                            onChangeText={setDescription}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>พิกัด GPS (แตะแผนที่เพื่อเปลี่ยนพิกัด)</Text>
                        <TouchableOpacity style={styles.gpsButton} onPress={getLocation} disabled={locationLoading}>
                            <Ionicons name="location-outline" size={20} color="#3B82F6" />
                            <Text style={styles.gpsButtonText}>
                                {locationLoading ? 'กำลังดึงตำแหน่ง...' :
                                    errorMsg ? errorMsg :
                                        location ? `${location.coords.latitude.toFixed(4)}° N, ${location.coords.longitude.toFixed(4)}° E` :
                                            'กดปุ่มรีเฟรชเพื่อดึงตำแหน่ง GPS'}
                            </Text>
                            <Ionicons name="refresh" size={20} color="#64748B" />
                        </TouchableOpacity>

                        {/* Map View Section */}
                        <View style={{ height: 200, width: '100%' }}>
                            <MyMapView location={location} setLocation={setLocation} />
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>อัพโหลดรูปภาพ</Text>
                        <TouchableOpacity style={styles.uploadBox}>
                            <Ionicons name="camera-outline" size={40} color="#94A3B8" />
                            <Text style={styles.uploadText}>แตะเพื่อถ่ายรูป หรือ เลือกจากอัลบั้ม</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
                        onPress={saveInstallation}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.submitButtonText}>บันทึกข้อมูล</Text>
                        )}
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
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#0F172A',
    },
    textArea: {
        minHeight: 100,
        paddingTop: 14,
    },
    gpsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    gpsButtonText: {
        flex: 1,
        marginLeft: 8,
        color: '#1E40AF',
        fontWeight: '500',
    },
    uploadBox: {
        height: 140,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#CBD5E1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadText: {
        marginTop: 12,
        color: '#64748B',
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 40,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

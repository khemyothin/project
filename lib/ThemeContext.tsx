import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    isDarkMode: false,
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('light');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // โหลดค่า Theme จาก AsyncStorage ทันทีที่เปิดแอป
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('@app_theme');
                if (savedTheme === 'light' || savedTheme === 'dark') {
                    setTheme(savedTheme);
                }
            } catch (error) {
                console.error('Failed to load theme from AsyncStorage:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        loadTheme();
    }, []);

    const toggleTheme = async () => {
        try {
            const newTheme = theme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
            // บันทึกค่า Theme ลง AsyncStorage เมื่อผ้ใช้กดสลับ
            await AsyncStorage.setItem('@app_theme', newTheme);
        } catch (error) {
            console.error('Failed to save theme to AsyncStorage:', error);
        }
    };

    const isDarkMode = theme === 'dark';

    if (!isLoaded) {
        // ป้องกันการโหลดแผง Theme ชั่วพริบตา
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

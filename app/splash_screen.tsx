import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router'; // <-- Adicionado

export default function SplashScreen() {
    const router = useRouter(); // <-- Adicionado

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.92)).current;
    const slideAnim = useRef(new Animated.Value(25)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 35, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();

        Animated.timing(progressAnim, { toValue: 1, duration: 5200, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(glowAnim, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ])
        ).start();

        // Após 7 segundos, navega para o Login (o as any evita erro de TypeScript)
        const timer = setTimeout(() => {
            router.replace('/login_screen' as any);
        }, 7000);

        return () => clearTimeout(timer);
    }, []);

    const glowScale = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] });
    const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['5%', '100%'] });

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.topLine} />
            <View style={styles.decorCircleOne} />
            <View style={styles.decorCircleTwo} />
            
            <View style={styles.content}>
                <Animated.View style={[styles.brand, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }, { scale: glowScale }] }]}>
                    <View style={styles.logoContainer}>
                        {/* Lembre-se de checar se o caminho da imagem está correto! */}
                        <Image source={require('../assets/images/logo Agrotech.png')} style={styles.logo} resizeMode="contain" />
                    </View>
                </Animated.View>

                <Animated.View style={[styles.footer, { opacity: fadeAnim, transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 25], outputRange: [0, 10] }) }] }]}>
                    <Text style={styles.title}>AGROTECH</Text>
                    <Text style={styles.subtitle}>Gestão agrícola inteligente</Text>
                    <View style={styles.progressTrack}>
                        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
                    </View>
                    <Text style={styles.loading}>CONECTANDO AO CAMPO...</Text>
                </Animated.View>
            </View>

            <View style={styles.bottomArea}>
                <View style={styles.bottomLine} />
                <Text style={styles.footerText}>TECNOLOGIA • DADOS • COLHEITA</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#090E11', overflow: 'hidden' },
    topLine: { height: 5, width: '100%', backgroundColor: '#A2C11C' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
    decorCircleOne: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: '#3E9946', opacity: 0.05, top: -100, right: -100 },
    decorCircleTwo: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: '#A2C11C', opacity: 0.03, bottom: -50, left: -80 },
    brand: { width: '80%', maxWidth: 320, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' },
    logoContainer: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    logo: { width: '100%', height: '100%' },
    footer: { width: '100%', alignItems: 'center', marginTop: -30 },
    title: { color: '#3E9946', fontSize: 16, fontWeight: '800', letterSpacing: 3, textAlign: 'center' },
    subtitle: { color: '#6B7882', fontSize: 12, marginTop: 5, letterSpacing: 0.5, textAlign: 'center' },
    progressTrack: { width: 190, height: 4, borderRadius: 10, backgroundColor: '#1A242B', overflow: 'hidden', marginTop: 25 },
    progressBar: { height: '100%', borderRadius: 10, backgroundColor: '#3E9946' },
    loading: { color: '#4A5B69', fontSize: 9, fontWeight: '700', letterSpacing: 1.5, marginTop: 15, textAlign: 'center' },
    bottomArea: { alignItems: 'center', paddingBottom: 35 },
    bottomLine: { width: 40, height: 2, borderRadius: 2, backgroundColor: '#A2C11C', marginBottom: 12 },
    footerText: { color: '#36454F', fontSize: 8, letterSpacing: 2.5, fontWeight: '600' },
});
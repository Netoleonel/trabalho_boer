import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../src/services/firebaseConfig';

export default function DashboardScreen() {
    const [abaAtiva, setAbaAtiva] = useState('home');

    const executeSignOut = async () => {
        try {
            await signOut(auth);
            router.replace('/login_screen' as any);
        } catch (error) {
            console.error('Erro no Firebase ao sair:', error);
            router.replace('/login_screen' as any);
        }
    };

    const handleLogout = () => {
        if (Platform.OS === 'web') {
            if (window.confirm('Deseja realmente desconectar do painel agrícola?')) {
                executeSignOut();
            }
        } else {
            Alert.alert('Sair', 'Deseja realmente desconectar do painel?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sair', style: 'destructive', onPress: executeSignOut },
            ]);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.topLine} />

            {/* Conteúdo Dinâmico conforme a Aba Selecionada */}
            <View style={styles.contentContainer}>
                {abaAtiva === 'home' && (
                    <ScrollView style={styles.tabContainer} contentContainerStyle={styles.scrollContent}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.welcomeText}>Olá, Bem-vindo(a)! 👋</Text>
                            <Text style={styles.subtitle}>Painel de Gestão Agrícola</Text>
                        </View>

                        <View style={styles.statsContainer}>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>12</Text>
                                <Text style={styles.statLabel}>Lotes Ativos</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>4</Text>
                                <Text style={styles.statLabel}>Alertas Hoje</Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>RESUMO RECENTE</Text>
                            <View style={styles.infoBox}>
                                <Text style={styles.infoTitle}>Próxima atividade</Text>
                                <Text style={styles.infoText}>Lote Sul — Irrigação 14:00</Text>
                            </View>
                        </View>
                    </ScrollView>
                )}

                {abaAtiva === 'lotes' && (
                    <ScrollView style={styles.tabContainer} contentContainerStyle={styles.scrollContent}>
                        <Text style={styles.pageTitle}>Gerenciamento de Lotes</Text>
                        
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Lote Alpha</Text>
                            <Text style={styles.cardDetail}>Cultura: Soja</Text>
                            <Text style={styles.cardDetail}>Status: Crescimento vegetativo</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Lote Beta</Text>
                            <Text style={styles.cardDetail}>Cultura: Milho</Text>
                            <Text style={styles.cardDetail}>Status: Pronto para colheita</Text>
                        </View>
                    </ScrollView>
                )}

                {abaAtiva === 'sensores' && (
                    <ScrollView style={styles.tabContainer} contentContainerStyle={styles.scrollContent}>
                        <Text style={styles.pageTitle}>Sensores e Dados</Text>
                        <Text style={styles.subtitle}>Integração em tempo real</Text>

                        <View style={styles.card}>
                            <Text style={styles.apiEndpoint}>Umidade do Solo</Text>
                            <Text style={styles.apiStatus}>Status: Níveis adequados (65%)</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.apiEndpoint}>Estação Meteorológica</Text>
                            <Text style={styles.apiStatus}>Status: Conectado (Sinal Forte)</Text>
                        </View>
                    </ScrollView>
                )}
            </View>

            {/* Barra de Navegação Inferior Customizada */}
            <View style={styles.tabBar}>
                <Pressable 
                    style={[styles.tabItem, abaAtiva === 'home' && styles.tabItemActive]} 
                    onPress={() => setAbaAtiva('home')}
                >
                    <Text style={[styles.tabLabel, abaAtiva === 'home' && styles.tabLabelActive]}>Home</Text>
                </Pressable>

                <Pressable 
                    style={[styles.tabItem, abaAtiva === 'lotes' && styles.tabItemActive]} 
                    onPress={() => setAbaAtiva('lotes')}
                >
                    <Text style={[styles.tabLabel, abaAtiva === 'lotes' && styles.tabLabelActive]}>Lotes</Text>
                </Pressable>

                <Pressable 
                    style={[styles.tabItem, abaAtiva === 'sensores' && styles.tabItemActive]} 
                    onPress={() => setAbaAtiva('sensores')}
                >
                    <Text style={[styles.tabLabel, abaAtiva === 'sensores' && styles.tabLabelActive]}>Sensores</Text>
                </Pressable>

                <Pressable 
                    style={styles.tabItem} 
                    onPress={handleLogout}
                >
                    <Text style={[styles.tabLabel, { color: '#E53935' }]}>Sair</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#090E11' },
    topLine: { height: 5, width: '100%', backgroundColor: '#A2C11C' },
    contentContainer: { flex: 1 },
    tabContainer: { flex: 1, backgroundColor: '#090E11' },
    scrollContent: { padding: 24 },
    tabBar: {
        backgroundColor: '#1A242B',
        borderTopWidth: 1,
        borderTopColor: '#2C3A44',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 4,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    tabItemActive: {
        borderTopWidth: 2,
        borderTopColor: '#A2C11C',
    },
    tabLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, color: '#6B7882' },
    tabLabelActive: { color: '#A2C11C' },
    cardHeader: { marginBottom: 20 },
    welcomeText: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
    subtitle: { fontSize: 14, color: '#6B7882', marginTop: 4 },
    pageTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    statCard: {
        flex: 0.48,
        backgroundColor: '#1A242B',
        borderWidth: 1,
        borderColor: '#2C3A44',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
    },
    statNumber: { fontSize: 28, fontWeight: '700', color: '#A2C11C' },
    statLabel: { fontSize: 12, color: '#FFFFFF', fontWeight: '600', marginTop: 4 },
    section: { marginTop: 10 },
    sectionTitle: { color: '#3E9946', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 },
    infoBox: {
        backgroundColor: '#1A242B',
        borderWidth: 1,
        borderColor: '#2C3A44',
        borderRadius: 10,
        padding: 16,
    },
    infoTitle: { color: '#6B7882', fontSize: 12 },
    infoText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginTop: 4 },
    card: {
        backgroundColor: '#1A242B',
        borderWidth: 1,
        borderColor: '#2C3A44',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
    },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
    cardDetail: { fontSize: 13, color: '#A2C11C' },
    apiEndpoint: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
    apiStatus: { fontSize: 12, color: '#3E9946', marginTop: 4, fontWeight: '600' },
});
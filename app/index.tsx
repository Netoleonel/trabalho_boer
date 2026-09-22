import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// ESSA LINHA É OBRIGATÓRIA PARA NÃO DAR O ERRO "missing default export"
export default function IndexScreen() {
    const router = useRouter(); 

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.topLine} />
            <View style={styles.main}>
                <Text style={styles.title}>AgroTech</Text>
                <Text style={styles.subtitle}>
                    O futuro da gestão agrícola inteligente começa aqui.
                </Text>

                <Pressable 
                    style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                    onPress={() => router.push('/splash_screen' as any)} 
                >
                    <Text style={styles.buttonText}>ACESSAR PLATAFORMA</Text>
                </Pressable>
            </View>
            <View style={styles.footer}>
                <View style={styles.bottomLine} />
                <Text style={styles.footerText}>TECNOLOGIA • DADOS • COLHEITA</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#090E11' },
    topLine: { height: 5, width: '100%', backgroundColor: '#A2C11C' },
    main: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, maxWidth: 960, marginHorizontal: 'auto' },
    title: { fontSize: 48, fontWeight: 'bold', color: '#3E9946', marginBottom: 12, letterSpacing: 2 },
    subtitle: { fontSize: 16, color: '#6B7882', textAlign: 'center', marginBottom: 48, lineHeight: 24 },
    button: { backgroundColor: '#3E9946', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 10, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#3E9946' },
    buttonPressed: { opacity: 0.8, backgroundColor: '#2E7D32' },
    buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', letterSpacing: 2 },
    footer: { alignItems: 'center', paddingBottom: 35 },
    bottomLine: { width: 40, height: 2, borderRadius: 2, backgroundColor: '#A2C11C', marginBottom: 12 },
    footerText: { color: '#36454F', fontSize: 8, letterSpacing: 2.5, fontWeight: '600' },
});
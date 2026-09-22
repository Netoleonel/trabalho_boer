import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/services/firebaseConfig';

export default function LoginScreen() {
    const router = useRouter(); // <-- Inicializando o router
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validarSenha = (senha: string) => {
        // Exige no mínimo 8 caracteres, letra, número e caractere especial
        return senha.length >= 8 && /[A-Za-z]/.test(senha) && /\d/.test(senha) && /[^A-Za-z\d]/.test(senha);
    };

    const handleLogin = async () => {
        let valido = true;
        setEmailError(''); setPasswordError('');

        if (!email.trim()) { setEmailError('Informe seu e-mail.'); valido = false; }
        else if (!validarEmail(email.trim())) { setEmailError('Informe um e-mail válido.'); valido = false; }

        if (!password.trim()) { setPasswordError('Informe sua senha.'); valido = false; }
        else if (!validarSenha(password)) { setPasswordError('A senha deve ter pelo menos 8 caracteres, incluindo letras, números e símbolos.'); valido = false; }

        if (!valido) return;

       setLoading(true);
        try {
            // Agora o login é de verdade no Firebase!
            await signInWithEmailAndPassword(auth, email.trim(), password);
            router.replace('/dashboard_screen' as any);
        } catch (error: any) {
            Alert.alert('Erro', 'E-mail ou senha incorretos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.topLine} />

            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Bem-vindo!</Text>
                            <Text style={styles.subtitle}>Acesse seu painel inteligente</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>E-MAIL</Text>
                                <TextInput
                                    style={[styles.input, emailError !== '' && styles.inputError]}
                                    placeholder="Digite seu e-mail"
                                    placeholderTextColor="#4A5B69"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                {emailError !== '' && <Text style={styles.errorText}>{emailError}</Text>}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>SENHA</Text>
                                <View style={[styles.passwordContainer, passwordError !== '' && styles.inputError]}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Digite sua senha"
                                        placeholderTextColor="#4A5B69"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.showButton}>
                                        <Text style={styles.showText}>{showPassword ? 'OCULTAR' : 'MOSTRAR'}</Text>
                                    </Pressable>
                                </View>
                                {passwordError !== '' && <Text style={styles.errorText}>{passwordError}</Text>}
                            </View>

                            <Pressable style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginButtonText}>ENTRAR</Text>}
                            </Pressable>

                            <View style={styles.registerContainer}>
                                <Text style={styles.registerText}>Ainda não possui uma conta?</Text>
                                {/* Botão para ir para a tela de registro */}
                                <Pressable onPress={() => router.push('/register_screen' as any)}>
                                    <Text style={styles.registerLink}>Cadastre-se</Text>
                                </Pressable>
                            </View>
                        </View>
                        <Text style={styles.footer}>AGROTECH</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#090E11' },
    flex: { flex: 1 },
    topLine: { height: 5, width: '100%', backgroundColor: '#A2C11C' },
    scrollContent: { flexGrow: 1 },
    content: { flex: 1, paddingHorizontal: 28, paddingTop: 55, paddingBottom: 30 },
    header: { alignItems: 'center', marginBottom: 42 },
    title: { color: '#FFFFFF', fontSize: 30, fontWeight: '700' },
    subtitle: { color: '#6B7882', fontSize: 14, marginTop: 8 },
    form: { width: '100%' },
    inputGroup: { marginBottom: 22 },
    label: { color: '#3E9946', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
    input: { height: 52, borderWidth: 1, borderColor: '#1A242B', borderRadius: 10, backgroundColor: '#1A242B', paddingHorizontal: 16, color: '#FFFFFF', fontSize: 15 },
    inputError: { borderColor: '#D94343' },
    passwordContainer: { height: 52, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1A242B', borderRadius: 10, backgroundColor: '#1A242B' },
    passwordInput: { flex: 1, height: '100%', paddingHorizontal: 16, color: '#FFFFFF', fontSize: 15 },
    showButton: { paddingHorizontal: 14 },
    showText: { color: '#A2C11C', fontSize: 9, fontWeight: '700' },
    errorText: { color: '#D94343', fontSize: 11, marginTop: 6 },
    loginButton: { height: 52, borderRadius: 10, backgroundColor: '#3E9946', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    loginButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', letterSpacing: 2 },
    registerContainer: { alignItems: 'center', marginTop: 28 },
    registerText: { color: '#6B7882', fontSize: 12 },
    registerLink: { color: '#A2C11C', fontSize: 13, fontWeight: '700', marginTop: 5 },
    footer: { color: '#6B7882', fontSize: 9, letterSpacing: 2.2, textAlign: 'center', marginTop: 45 },
});
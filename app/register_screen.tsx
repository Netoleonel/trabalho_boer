import React, { useState } from 'react';
import { 
    Alert, 
    Platform, 
    Pressable, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TextInput, 
    View 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../src/services/firebaseConfig';

export default function RegisterScreen() {
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);

    // Estados para controlar a visibilidade das senhas
    const [secureSenha, setSecureSenha] = useState(true);
    const [secureConfirmar, setSecureConfirmar] = useState(true);

    // Regras de validação de senha (atualizado para mínimo de 8 caracteres)
    const hasMinLength = senha.length >= 8;
    const hasUpperCase = /[A-Z]/.test(senha);
    const hasNumber = /[0-9]/.test(senha);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

    const handleRegister = async () => {
        if (!nome.trim() || !sobrenome.trim() || !email.trim() || !senha.trim()) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            return;
        }

        if (!hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar) {
            Alert.alert('Senha Inválida', 'A senha não atende aos requisitos de segurança.');
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), senha);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: `${nome.trim()} ${sobrenome.trim()}`
            });

            await set(ref(database, 'usuarios/' + user.uid), {
                nome: nome.trim(),
                sobrenome: sobrenome.trim(),
                email: email.trim(),
                criadoEm: new Date().toISOString()
            });

            if (Platform.OS === 'web') {
                window.alert('Conta criada com sucesso!');
            } else {
                Alert.alert('Sucesso', 'Conta criada com sucesso!');
            }

            router.replace('/dashboard_screen' as any);

        } catch (error: any) {
            console.error('Erro ao cadastrar:', error);
            let mensagemErro = 'Não foi possível realizar o cadastro.';
            if (error.code === 'auth/email-already-in-use') {
                mensagemErro = 'Este e-mail já está cadastrado.';
            } else if (error.code === 'auth/invalid-email') {
                mensagemErro = 'E-mail inválido.';
            } else if (error.code === 'auth/weak-password') {
                mensagemErro = 'A senha é muito fraca.';
            }
            Alert.alert('Erro no Cadastro', mensagemErro);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <StatusBar style="light" />
            <View style={styles.topLine} />

            <View style={styles.header}>
                <Text style={styles.title}>Criar Conta 🌾</Text>
                <Text style={styles.subtitle}>Insira seus dados para acessar o AgroTech</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: João"
                    placeholderTextColor="#6B7882"
                    value={nome}
                    onChangeText={setNome}
                />

                <Text style={styles.label}>Sobrenome</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Silva"
                    placeholderTextColor="#6B7882"
                    value={sobrenome}
                    onChangeText={setSobrenome}
                />

                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor="#6B7882"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>Senha</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Sua senha segura"
                        placeholderTextColor="#6B7882"
                        secureTextEntry={secureSenha}
                        value={senha}
                        onChangeText={setSenha}
                    />
                    <Pressable 
                        style={styles.eyeButton} 
                        onPress={() => setSecureSenha(!secureSenha)}
                    >
                        <Text style={styles.eyeText}>{secureSenha ? '👁️' : '🙈'}</Text>
                    </Pressable>
                </View>

                {/* Caixa de Verificação de Regras da Senha */}
                <View style={styles.rulesContainer}>
                    <Text style={styles.rulesTitle}>Requisitos da Senha:</Text>
                    <Text style={[styles.ruleItem, hasMinLength ? styles.ruleValid : styles.ruleInvalid]}>
                        {hasMinLength ? '✓' : '•'} Mínimo de 8 caracteres
                    </Text>
                    <Text style={[styles.ruleItem, hasUpperCase ? styles.ruleValid : styles.ruleInvalid]}>
                        {hasUpperCase ? '✓' : '•'} Pelo menos uma letra maiúscula
                    </Text>
                    <Text style={[styles.ruleItem, hasNumber ? styles.ruleValid : styles.ruleInvalid]}>
                        {hasNumber ? '✓' : '•'} Pelo menos um número
                    </Text>
                    <Text style={[styles.ruleItem, hasSpecialChar ? styles.ruleValid : styles.ruleInvalid]}>
                        {hasSpecialChar ? '✓' : '•'} Pelo menos um caractere especial (!@#$...)
                    </Text>
                </View>

                <Text style={styles.label}>Confirmar Senha</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirme sua senha"
                        placeholderTextColor="#6B7882"
                        secureTextEntry={secureConfirmar}
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                    />
                    <Pressable 
                        style={styles.eyeButton} 
                        onPress={() => setSecureConfirmar(!secureConfirmar)}
                    >
                        <Text style={styles.eyeText}>{secureConfirmar ? '👁️' : '🙈'}</Text>
                    </Pressable>
                </View>

                <Pressable 
                    style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'CADASTRANDO...' : 'CADASTRAR CONTA'}</Text>
                </Pressable>

                <Pressable 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Já tem uma conta? Faça login</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#090E11' },
    topLine: { height: 5, width: '100%', backgroundColor: '#A2C11C' },
    scrollContent: { padding: 24, justifyContent: 'center' },
    header: { marginBottom: 24, marginTop: 12 },
    title: { fontSize: 26, fontWeight: '700', color: '#FFFFFF' },
    subtitle: { fontSize: 14, color: '#6B7882', marginTop: 4 },
    formContainer: { width: '100%' },
    label: { fontSize: 13, fontWeight: '600', color: '#FFFFFF', marginBottom: 6, marginTop: 12 },
    input: {
        backgroundColor: '#1A242B',
        borderWidth: 1,
        borderColor: '#2C3A44',
        borderRadius: 10,
        height: 50,
        paddingHorizontal: 16,
        color: '#FFFFFF',
        fontSize: 15,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A242B',
        borderWidth: 1,
        borderColor: '#2C3A44',
        borderRadius: 10,
        height: 50,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        color: '#FFFFFF',
        fontSize: 15,
        height: '100%',
    },
    eyeButton: {
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    eyeText: { fontSize: 18 },
    rulesContainer: {
        backgroundColor: '#11171D',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#1A242B',
    },
    rulesTitle: { fontSize: 12, fontWeight: '700', color: '#6B7882', marginBottom: 4 },
    ruleItem: { fontSize: 12, marginVertical: 2 },
    ruleValid: { color: '#A2C11C', fontWeight: '600' },
    ruleInvalid: { color: '#6B7882' },
    button: {
        backgroundColor: '#A2C11C',
        height: 52,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    buttonPressed: { opacity: 0.8 },
    buttonText: { color: '#090E11', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
    backButton: { alignItems: 'center', marginTop: 16, padding: 8 },
    backButtonText: { color: '#6B7882', fontSize: 14, fontWeight: '600' },
});
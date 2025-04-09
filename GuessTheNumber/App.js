import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";

export default function App() {
  const [secretNumber, setSecretNumber] = useState(null);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("Digite um número entre 1 e 100");
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [hint, setHint] = useState('');

  // Inicializa o jogo
  useEffect(() => {
    startNewGame();
  }, []);

  function startNewGame() {
    const newNumber = Math.floor(Math.random() * 100) + 1;
    setSecretNumber(newNumber);
    setGuess('');
    setAttempts(0);
    setFeedback("Digite um número entre 1 e 100");
    setGameStatus('playing');
    setHint('');
  }

  function handleGuess() {
    if (gameStatus !== 'playing') {
      startNewGame();
      return;
    }

    if (!guess.trim()) {
      Alert.alert("Ops!", "Por favor, digite um número");
      return;
    }

    const guessedNumber = parseInt(guess);
    if (isNaN(guessedNumber) || guessedNumber < 1 || guessedNumber > 100) {
      Alert.alert("Número inválido", "Digite um número entre 1 e 100");
      return;
    }

    Keyboard.dismiss();
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (guessedNumber === secretNumber) {
      setFeedback(`Parabéns! Você acertou em ${newAttempts} tentativas!`);
      setGameStatus('won');
      setHint('');
      return;
    }

    if (newAttempts >= 5) {
      setFeedback(`Fim de jogo! O número era ${secretNumber}.`);
      setGameStatus('lost');
      setHint('');
      return;
    }

    const difference = Math.abs(secretNumber - guessedNumber);
    let newHint = '';

    if (difference <= 5) {
      newHint = '🔥 Está pegando fogo!';
    } else if (difference <= 15) {
      newHint = '☀️ Está ficando quente...';
    } else if (difference <= 30) {
      newHint = '🌤️ Morno...';
    } else {
      newHint = '❄️ Está frio!';
    }

    setHint(newHint);
    setFeedback(`Tente novamente! Tentativas: ${newAttempts}/5`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GuessTheNumber</Text>
        <Text style={styles.subtitle}>Adivinhe o número secreto</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Seu palpite</Text>
          <TextInput
            style={styles.input}
            value={guess}
            onChangeText={setGuess}
            placeholder="Digite um número (1-100)"
            placeholderTextColor="#A0A0A0"
            keyboardType="numeric"
            editable={gameStatus === 'playing'}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, gameStatus !== 'playing' && styles.buttonNewGame]}
          onPress={handleGuess}
        >
          <Ionicons 
            name={gameStatus === 'playing' ? "search" : "refresh"} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.buttonText}>
            {gameStatus === 'playing' ? "Verificar" : "Novo Jogo"}
          </Text>
        </TouchableOpacity>

        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>{feedback}</Text>
          
          {hint ? (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>{hint}</Text>
            </View>
          ) : null}

          {gameStatus === 'playing' && attempts > 0 && (
            <Text style={styles.attemptsText}>Tentativas usadas: {attempts}</Text>
          )}
        </View>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  header: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B263B',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 50,
  },
  title: {
    color: '#E63946',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  subtitle: {
    color: '#F4F3EE',
    fontSize: 18,
    marginTop: 10,
  },
  content: {
    flex: 1,
    padding: 30,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    color: '#F4F3EE',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#0A141F',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#F4F3EE',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#415A77',
  },
  button: {
    backgroundColor: '#E63946',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    borderRadius: 10,
    marginVertical: 15,
  },
  buttonNewGame: {
    backgroundColor: '#457B9D',
  },
  buttonText: {
    color: '#F4F3EE',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
  },
  feedbackContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  feedbackText: {
    color: '#F4F3EE',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
  },
  hintContainer: {
    marginVertical: 10,
  },
  hintText: {
    color: '#F2392C',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  attemptsText: {
    color: '#F4F3EE',
    fontSize: 16,
    marginTop: 15,
  },
});
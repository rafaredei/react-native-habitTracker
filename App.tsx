import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [creatingHabit, setCreatingHabit] = useState(false);
  const [newHabitText, setNewHabitText] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];

  const [data, setData] = useState([
    { type: 'header', key: 'your', id: '0', hours: 0, minutes: 0, seconds: 0 },
    { type: 'habit', key: 'Workout', id: '1', completed: false },
    { type: 'habit', key: 'Read for 30 minutes', id: '2', completed: false },
    { type: 'habit', key: 'Guitar practice', id: '3', completed: false },
  ]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor(((diff % (1000 * 60 * 60)) % (1000 * 60)) / 1000);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);

      setData(prevData =>
        prevData.map(item =>
          item.type === 'header' ? { ...item, hours, minutes, seconds } : item
        )
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const showCreatePrompt = () => {
    setCreatingHabit(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideCreatePrompt = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCreatingHabit(false);
      setNewHabitText('');
    });
  };

  const toggleCompletion = (id) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id && item.type === 'habit'
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const renderItem = ({ item, drag, isActive }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.headerTextContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Your</Text>
            <Text style={[styles.text, { marginTop: 0 }]}>Habits (2)</Text>
            <Text style={styles.bedtimeText}>{item.hours}h {item.minutes}m {item.seconds}s</Text>
          </View>
          <View style={styles.totalStreakBubble}>
            <Text style={styles.totalStreakText}>15</Text>
          </View>
        </View>
      );
    } else if (item.type === 'habit') {
      return (
        <TouchableOpacity
          onPress={() => toggleCompletion(item.id)}
          onLongPress={drag}
          delayLongPress={150}
          style={[styles.cardWrapper, isActive && { opacity: 0.7 }]}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={item.completed ? ['#98FB98', '#90EE90'] : ['#DDA0DD', '#E6E6FA']}
            style={styles.cardContainer}
          >
            <View style={styles.habitTextContainer}>
              <Text style={styles.cardText}>{item.key}</Text>
            </View>
            <View style={styles.streakTextContainer}>
              <Text style={[styles.cardText, { fontSize: 25 }]}>23</Text>
              <Text style={[styles.cardText, { fontSize: 16 }]}>day streak</Text>
            </View>
            <View style={styles.editButtonContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => alert('Edit ' + item.key)}>
                <Icon name="create-outline" size={25} color="black" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.container}>
            <DraggableFlatList
              data={data}
              keyExtractor={(item) => item.id}
              onDragEnd={({ data }) => setData(data)}
              renderItem={renderItem}
              contentContainerStyle={styles.contentContainer}
            />

            <View style={styles.createButtonContainer}>
              <TouchableOpacity style={styles.createButton} onPress={showCreatePrompt}>
                <Icon name="add-outline" size={40} color="black" />
              </TouchableOpacity>
            </View>

            {creatingHabit && (
              <TouchableWithoutFeedback onPress={hideCreatePrompt}>
                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}> 
                  <TouchableWithoutFeedback onPress={() => {}}>
                    <View style={styles.promptContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="New habit"
                        placeholderTextColor="#999"
                        value={newHabitText}
                        onChangeText={setNewHabitText}
                        autoFocus
                      />
                      <TouchableOpacity
                        style={styles.checkmark}
                        onPress={() => {
                          if (newHabitText.trim()) {
                            setData(prevData => [
                              ...prevData,
                              {
                                type: 'habit',
                                key: newHabitText,
                                id: Date.now().toString(),
                                completed: false,
                              },
                            ]);
                          }
                          hideCreatePrompt();
                        }}
                      >
                        <Icon name="checkmark" size={30} color="black" />
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </Animated.View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {},
  text: {
    color: 'black',
    fontSize: 45,
    fontWeight: 'bold',
  },
  bedtimeText: {
    paddingTop: 0,
    color: 'black',
    fontSize: 25,
  },
  cardWrapper: {
    width: Dimensions.get('window').width * 0.9,
  },
  cardContainer: {
    height: 250,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardText: {
    color: '#333',
    fontSize: 50,
    fontWeight: 'bold',
    paddingTop: 0,
    paddingLeft: 15,
  },
  headerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    width: '100%',
    paddingRight: 20,
  },
  textContainer: {
    flexDirection: 'column',
  },
  totalStreakBubble: {
    backgroundColor: 'grey',
    borderRadius: 45,
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalStreakText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  habitTextContainer: {
    paddingTop: 20,
  },
  streakTextContainer: {
    position: 'absolute',
    paddingTop: 160,
  },
  editButtonContainer: {
    position: 'absolute',
    right: 15,
    bottom: 30,
  },
  editButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  createButtonContainer: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 30,
    marginTop: -50,
  },
  createButton: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: 'snow',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  promptContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '85%',
  },
  input: {
    flex: 1,
    fontSize: 20,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
  },
  checkmark: {
    padding: 10,
    backgroundColor: 'lightgreen',
    borderRadius: 50,
  },
});

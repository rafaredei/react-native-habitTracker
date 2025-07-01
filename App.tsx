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
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const menuAnim = useState(new Animated.Value(0))[0];
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

  const showPrompt = (text = '', id = null) => {
    setNewHabitText(text);
    setEditingHabitId(id);
    setCreatingHabit(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hidePrompt = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCreatingHabit(false);
      setNewHabitText('');
      setEditingHabitId(null);
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

  const deleteHabit = (id) => {
    setData(prevData => prevData.filter(item => item.id !== id));
    setMenuVisibleId(null);
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
          style={[styles.cardWrapper, { alignSelf: 'center' }, isActive && { opacity: 0.7 }]}
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
              <TouchableOpacity
                style={styles.editButtonPlain}
                onPress={() => {
                  setMenuVisibleId(menuVisibleId === item.id ? null : item.id);
                  Animated.timing(menuAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                  }).start();
                }}
              >
                <Icon name="ellipsis-horizontal" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {menuVisibleId === item.id && (
              <Animated.View style={[styles.dropdownMenuLight, { opacity: menuAnim, transform: [{ scale: menuAnim }] }]}>
                <TouchableOpacity onPress={() => { setMenuVisibleId(null); showPrompt(item.key, item.id); }}>
                  <Text style={styles.menuItemLight}>Edit</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity onPress={() => deleteHabit(item.id)}>
                  <Text style={styles.menuItemLight}>Delete</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      );
    } else if (item.type === 'create') {
      return (
        <View style={styles.createButtonContainer}>
          <TouchableOpacity style={styles.createButton} onPress={() => showPrompt()}>
            <Icon name="add-outline" size={40} color="black" />
          </TouchableOpacity>
        </View>
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
              data={[...data, { type: 'create', id: 'create' }]}
              keyExtractor={(item) => item.id}
              onDragEnd={({ data }) => setData(data.filter(d => d.type !== 'create'))}
              renderItem={renderItem}
              contentContainerStyle={styles.contentContainer}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  contentContainer: { paddingBottom: 80 },
  text: { color: 'black', fontSize: 36, fontWeight: 'bold' },
  bedtimeText: { color: 'black', fontSize: 20 },
  headerTextContainer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20,
  },
  textContainer: { flexDirection: 'column' },
  totalStreakBubble: {
    backgroundColor: 'grey', borderRadius: 40, width: 80, height: 80, justifyContent: 'center', alignItems: 'center',
  },
  totalStreakText: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  cardWrapper: { paddingVertical: 5 },
  cardContainer: {
    width: Dimensions.get('window').width * 0.9,
    height: 150,
    borderRadius: 30,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardText: { color: '#333', fontSize: 28, fontWeight: 'bold' },
  habitTextContainer: { paddingBottom: 10 },
  streakTextContainer: { position: 'absolute', bottom: 20, left: 20 },
  editButtonContainer: { position: 'absolute', top: 20, right: 20 },
  editButtonPlain: { padding: 8 },
  dropdownMenuLight: {
    position: 'absolute', top: 60, right: 0, backgroundColor: '#fff', borderRadius: 10,
    paddingVertical: 4, width: 120, elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 3,
  },
  menuItemLight: {
    paddingVertical: 10, paddingHorizontal: 16, fontSize: 16, color: '#000',
  },
  menuDivider: {
    height: 1, backgroundColor: '#eee', marginHorizontal: 12,
  },
  createButtonContainer: {
    alignItems: 'center', marginTop: 10, marginBottom: 0,
  },
  createButton: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: 'snow',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2, elevation: 3,
  },
});
